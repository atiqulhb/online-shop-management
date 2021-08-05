require('dotenv').config()
const path = require('path')
const { v4: uuid } = require('uuid');
const { Text, Float, Password, Checkbox, Select, Integer, Relationship, DateTime, DateTimeUtc, File } = require('@keystonejs/fields');
const { LocalFileAdapter } = require('@keystonejs/file-adapters');
const { byTracking, atTracking } = require('@keystonejs/list-plugins')
const { PubSub } = require('graphql-subscriptions')
const { userIsAdmin, userCanAccessUsers } = require('./utils/access');
const { sendEmail } = require('./emails');
const { transport, makeANiceEmail } = require('./emails/mail')
const { authenticator } = require('otplib')
const nodemailer = require('nodemailer')
const { google } = require("googleapis")

const stripe = require('stripe')(process.env.STRIPE_SECRET)


const OAuth2 = google.auth.OAuth2

const fileAdapter = new LocalFileAdapter({
  src: process.env.NODE_ENV === 'production' ? path.join(__dirname, '/dist/files') : path.join(__dirname, '/files'),
  path: `${process.env.CURRENT_SERVER_ADDRESS}/files`
})

const pubsub = new PubSub()


exports.Stock = {
  fields: {
    name: { type: Text },
    image: {
      type: File,
      adapter: fileAdapter,
      hooks: {
        beforeChange: async ({ existingItem }) => {
          if (existingItem && existingItem.file) {
            await fileAdapter.delete(existingItem.file);
          }
        },
      },
    },
    imageAttribution: { type: Text },
    quantity: { type: Float },
    buyingPrice: { type: Float },
    date: { type: DateTime },
    published: { type: Checkbox, DefaultValue: false },
    publishedProduct: { type: Checkbox },
  },
  hooks: {
    afterDelete: async ({ existingItem }) => {
      if (existingItem.file) {
        await fileAdapter.delete(existingItem.file);
      }
    },
  }
}

exports.Product = {
  fields: {
    name: { type: Text },
    weight: { type: Float },
    price: { type: Float },
    brand: { type: Text },
    category: { type: Text },
    image: {
      type: File,
      adapter: fileAdapter,
      isRequired: true,
      hooks: {
        beforeChange: async ({ existingItem }) => {
          if (existingItem && existingItem.file) {
            await fileAdapter.delete(existingItem.file);
          }
        },
      },
    },
    imageAttribution: { type: Text },
    details: { type: Text },
    numberOfViews: { type: Integer }
  },
  hooks: {
    afterDelete: async ({ existingItem }) => {
      if (existingItem.file) {
        await fileAdapter.delete(existingItem.file);
      }
    },
  },
};

exports.Message = {
  fields: {
    from: { type: Relationship, ref: 'User', isRequired: true },
    to: { type: Relationship, ref: 'User', isRequired: true },
    text: { type: Text, isRequired: true },
    timeStamp: { type: DateTime, isRequired: true }
  },
  hooks: {
    afterChange: ({ updatedItem, originalInput }) => {
      pubsub.publish('New_MESSAGE', updatedItem )
    }
  }
}

exports.Role = {
  fields: {
    title: { type: Text, defaultValue: "USER" },
    assignTo: { type: Relationship, ref: 'User.role', many: true }
  }
}

exports.User = {
  // access: {
  //   // anyone should be able to create a user (sign up)
  //   create: true,
  //   // only admins can see the list of users
  //   read: userCanAccessUsers,
  //   update: userCanAccessUsers,
  //   delete: userIsAdmin,
  // },
  fields: {
    name: { type: Text },
    email: { type: Text, isUnique: true, isRequired: true },
    isAdmin: { type: Checkbox, defaultValue: false },
    password: { type: Password, isRequired: true },
    cart: { type: Relationship, ref: 'Cart.owner', many: false },
    orders: { type: Relationship, ref: 'Order.orderer', many: true },
    messages: { type: Relationship, ref: 'Message', many: true },
    role: { type: Relationship, ref: 'Role.assignTo', many: true },
    secret: { type: Text }
    // plugins: [atTracking(), byTracking()],
  },
}

exports.Location = {
  fields: {
    latitude: { type: Float },
    longitude: { type: Float }
  }
}

exports.DeliveryBoy = {
  fields: {
    name: { type: Text },
    currentLocation: { type: Relationship, ref: 'Location' }
  }
}

exports.Cart = {
  fields: {
    owner: { type: Relationship, ref: 'User.cart', many: false },
    cartItems: { type: Relationship, ref: 'CartItem.cart', many: true },
    totalItems: { type: Integer, defaultValue: 0 },
    totalAmounts: { type: Float, defaultValue: 0 }
  }
}

// exports.Testing = {
//   fields: {
//     name: { type: Text },
//   },
//   hooks: {
//     resolveInput: ({ resolvedData }) => {
//       console.log(resolvedData)
//       return {
//         name: `${resolvedData.name} and the test is working!`,
//       };
//     },
//   },
// };


exports.CartItem = {
  fields: {
    cart: { type: Relationship, ref: 'Cart.cartItems', isRequired: true, many: false },
    item: { type: Relationship, ref: 'Product', isRequired: true },
    quantity: { type: Integer, isRequired: true, defaultValue: 1},
  }
}

exports.Order = {
  fields: {
    orderer: { type: Relationship, ref: 'User.orders', many: false },
    cart: { type: Relationship, ref: 'Cart', many: false },
    timeStamp: { type: DateTime },
    totalItems: { type: Integer },
    totalAmounts: { type: Float },
    delivery: { type: Relationship, ref: 'Delivery.order', many: false }
  },
  hooks: {
    afterChange: ({ updatedItem }) => {
      pubsub.publish('ORDER_MADE', updatedItem )
    }
  }
}

exports.Courier = {
  fields: {
    name: { type: Text },
    email: { type: Text, isRequired: true },
    phoneNumber: { type: Text, isRequired: true },
    deliveries: { type: Relationship, ref: 'Delivery.courier', many: true },
  }
}

exports.Position = {
  fields: {
    longitude: { type: Float },
    latitude: { type: Float },
  },
  hooks: {
    afterChange: ({ updatedItem }) => {
      pubsub.publish('CURRENT_LOCATION', updatedItem )
    }
  }
}


exports.Delivery = {
  fields: {
    order: { type: Relationship, ref: 'Order.delivery', many: false },
    courier: { type: Relationship, ref: 'Courier.deliveries', many: false },
    delivered: { type: Checkbox },
    arriverd: { type: Checkbox },
    position: { type: Relationship, ref: 'Position', many: true },
    journeyStarted: { type: Checkbox }
  },
  hooks: {
    afterChange: ({ updatedItem }) => {
      // pubsub.publish('ORDER_MADE', updatedItem )
    }
  }
}




exports.ForgottenPasswordToken = {
  // access: {
  //   create: true,
  //   read: true,
  //   update: access.userIsAdmin,
  //   delete: access.userIsAdmin,
  // },
  fields: {
    user: {
      type: Relationship,
      ref: 'User',
      // access: {
      //   read: access.userIsAdmin,
      // },
    },
    token: {
      type: Text,
      isRequired: true,
      isUnique: true,
      // access: {
      //   read: access.userIsAdmin,
      // },
    },
    requestedAt: { type: DateTime, isRequired: true },
    accessedAt: { type: DateTime },
    expiresAt: { type: DateTime, isRequired: true },
  },
  hooks: {
    afterChange: async ({ context, updatedItem, existingItem }) => {
      if (existingItem) return null;

      const now = new Date().toISOString();

      const { errors, data } = await context.executeGraphQL({
        context: context.createContext({ skipAccessControl: true }),
        query: `
        query GetUserAndToken($user: ID!, $now: DateTime!) {
          User( where: { id: $user }) {
            id
            email
          }
          allForgottenPasswordTokens( where: { user: { id: $user }, expiresAt_gte: $now }) {
            token
            expiresAt
          }
        }
      `,
        variables: { user: updatedItem.user.toString(), now },
      });

      if (errors) {
        console.error(errors, `Unable to construct password updated email.`);
        return;
      }

      const { allForgottenPasswordTokens, User } = data;
      const forgotPasswordKey = allForgottenPasswordTokens[0].token;
//       const url = process.env.SERVER_URL || 'http://localhost:3000';
// 
//       const props = {
//         forgotPasswordUrl: `${url}/change-password?key=${forgotPasswordKey}`,
//         recipientEmail: User.email,
//       };

      // this is option for mailgun transport

      // const options = {
      //   subject: 'Request for password reset',
      //   to: User.email,
      //   from: process.env.MAILGUN_FROM,
      //   domain: process.env.MAILGUN_DOMAIN,
      //   apiKey: process.env.MAILGUN_API_KEY,
      // };

      // options for nodemailer transport

//       const options = {
//         subject: 'Request for password reset',
//         to: User.email,
//         from: 'atiqulbhuiyan@gmail.com',
//       };
// 
//       await sendEmail('forgot-password.jsx', props, options);


      // wesbos solution

      const mailRes = await transport.sendMail({
        from: 'atique@veneraweb.com',
        to: User.email,
        subject: 'Your Password Reset Token',
        html: makeANiceEmail(`Your Password Reset Token is here!
          \n\n
          <a href="${process.env.FRONTEND_URL}/change-password?key=${forgotPasswordKey}">Click Here to Reset</a>`),
      });

      // 4. Return the message
      return { message: 'Check your email son!' };
    },
  },
};



exports.customSchema = {
  types: [
    {
      type: 'type AdvanceUserType { name: String, email: String }'
    },
    {
      type: 'type ViewCount { id: ID!, numberOfViews: Int! }'
    },
    {
      type: 'type SuccessMessage { success: Boolean }'
    }
  ],
  queries: [
    {
      schema: 'allAdvanceTypedUsers: [AdvanceUserType]',
      resolver: async (parent, args, context, info) => {

        const { data: { allUsers } } = await context.executeGraphQL({
          query:
          `
            {
              allUsers {
                name
                email
              }
            }
          `
        });

        return allUsers

        // can be used in this way too

//         const msg = 'Cannot find the user with given email';
// 
//         if (error || !data) {
//           console.error(error);
//           return Promise.reject(msg);
//         }
//         const usr = data.allUsers || [];
//         if (!usr) return Promise.reject(msg);
//         console.log(usr);
//         return Promise.resolve(usr);
      }
    },
  ],
  mutations: [
    {
      schema: 'addAdvanceTypedUser(name: String, email: String, password: String): AdvanceUserType',
      resolver: async (_, args, context) => {
         const { data, errors } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: gql`
            mutation createUser(
              $name: String
              $email: String
              $password: String
            ){
              authenticate: authenticateUserWithPassword (data: {
                name: $name 
                email: $email
                password: $password
              }){
                name
                email
              }
            }
          `,
          variables: args,
        });

        if (errors) {
          console.error(errors, `Unable to create account`);
          return;
        }

        return data.createUser
      }
    },
    {
      schema: 'advanceLogin(email: String!, password: String!): AdvanceUserType',
      resolver: async (_, args, context) => {
        const { data, errors } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query:
          `
            mutation advaceLogin(
              $email: String
              $password: String
            ){
              authenticateUserWithPassword (
                name: $name 
                email: $email
                password: $password
              ){
               item {
                 name
                 email
               }
              }
            }
          `,
          variables: args,
        });

        if (errors) {
          console.error(errors, `Unable to create account`);
          return;
        }

        return data?.advanceLogin
      }
    },
    {
      schema: 'AddToViewCount(id: ID!, numberOfViews: Int!): ViewCount',
      resolver: async (_, args, context) => {
//         const { data, errors } = await context.executeGraphQL({
//           context: context.createContext({ skipAccessControl: true }),
//           query:
//           `
//             mutation advaceLogin(
//               $email: String
//               $password: String
//             ){
//               authenticateUserWithPassword (
//                 name: $name 
//                 email: $email
//                 password: $password
//               ){
//                item {
//                  name
//                  email
//                }
//               }
//             }
//           `,
//           variables: args,
//         });
// 
//         if (errors) {
//           console.error(errors, `Unable to create account`);
//           return;
//         }
// 
//         console.log(data)
//         return data?.advanceLogin
      }
    },
    {
      schema: 'startPasswordRecovery(email: String!): ForgottenPasswordToken',
      resolver: async (obj, { email }, context) => {

        const { errors: userErrors, data: userData } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `
            query findUserByEmail($email: String!) {
              allUsers(where: { email: $email }) {
                id
                email
              }
            }
          `,
          variables: { email },
        });

        if (userErrors || !userData.allUsers || !userData.allUsers.length) {
          console.error(
            userErrors,
            `Unable to find user when trying to create forgotten password token.`
          );
          return;
        }

        const userId = userData.allUsers[0].id;
        const token = uuid();
        const tokenExpiration = parseInt(process.env.RESET_PASSWORD_TOKEN_EXPIRY) || 1000 * 60 * 60 * 24;
        const now = Date.now();
        const requestedAt = new Date(now).toISOString();
        const expiresAt = new Date(now + tokenExpiration).toISOString();

        const result = {
          userId,
          token,
          requestedAt,
          expiresAt,
        };

        const { data: ForGottenPasswordData, errors } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `
            mutation createForgottenPasswordToken(
              $userId: ID!,
              $token: String,
              $requestedAt: DateTime,
              $expiresAt: DateTime,
            ) {
              createForgottenPasswordToken(data: {
                user: { connect: { id: $userId }},
                token: $token,
                requestedAt: $requestedAt,
                expiresAt: $expiresAt,
              }) {
                id
                token
                user {
                  id
                }
                requestedAt
                expiresAt
              }
            }
          `,
          variables: result,
        });

        if (errors) {
          console.error(errors, `Unable to create forgotten password token.`);
          return;
        }

        return { id: ForGottenPasswordData.createForgottenPasswordToken.id};
      },
    },
    {
      schema: 'changePasswordWithToken(token: String!, password: String!): User',
      resolver: async (obj, { token, password }, context) => {
        const now = Date.now();

        const { errors, data } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `
            query findUserFromToken($token: String!, $now: DateTime!) {
              passwordTokens: allForgottenPasswordTokens(where: { token: $token, expiresAt_gte: $now }) {
                id
                token
                user {
                  id
                }
              }
            }`,
          variables: { token, now },
        });

        if (errors || !data.passwordTokens || !data.passwordTokens.length) {
          console.error(errors, `Unable to find token`);
          throw errors.message;
        }

        const user = data.passwordTokens[0].user.id;
        const tokenId = data.passwordTokens[0].id;

        const { data: UpdatePasswordData , errors: passwordError } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `mutation UpdateUserPassword($user: ID!, $password: String!) {
            updateUser(id: $user, data: { password: $password }) {
              id
            }
          }`,
          variables: { user, password },
        });

        if (passwordError) {
          console.error(passwordError, `Unable to change password`);
          throw passwordError.message;
        }

        await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `mutation DeletePasswordToken($tokenId: ID!) {
            deleteForgottenPasswordToken(id: $tokenId) {
              id
            }
          }
        `,
          variables: { tokenId },
        });

        return {id : UpdatePasswordData.updateUser.id};
      },
    },
    {
      schema: 'addToCart(productId: ID!, quantity: Int!, userId: ID!): CartItem',
      resolver: async (obj, { productId, quantity, userId }, context) => {
        // const { id: userId } = context.authedItem;
        // console.log(userId)

        console.log(userId)

        let CartId

        const { data } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `
            query FIND_CART($userId: ID!) {
              User(where: {
                id: $userId
              }){
                cart {
                  id
                  cartItems {
                    id
                  }
                }
              }
            }
          `,
          variables: { userId }
        })

        console.log(data)

        if (!data.User.cart) {
          console.log('no cart yet')

          const { data: { createCart } } = await context.executeGraphQL({
            context: context.createContext({ skipAccessControl: true }),
            query: `
              mutation CREATE_CART ($userId: ID!) {
                createCart (data: {
                  owner: {
                    connect: { id: $userId }
                  } 
                }){
                  id
                }
              }
            `,
            variables: { userId }
          })

          console.log('cart has been created')
          console.log(createCart)

          cartId = createCart.id

          const { data: { createCartItem } } = await context.executeGraphQL({
            context: context.createContext({ skipAccessControl: true }),
            query: `
              mutation CREATE_CART_ITEM ($cartId: ID!, $productId: ID!, $quantity: Int!) {
                createCartItem (data: {
                  cart: { connect: { id: $cartId } }
                  item: { connect: { id: $productId } }
                  quantity: $quantity
                }){
                  id
                }
              }
            `,
            variables: { cartId, productId, quantity }
          })

          console.log('newly created cart item id: ' + createCartItem.id )

          return createCartItem

        } else {
          console.log('cart has been found')

          cartId = data.User.cart.id
          const cartItems = data.User.cart.cartItems
          console.log(cartItems)


          const { data: { allCartItems } } = await context.executeGraphQL({
            context: context.createContext({ skipAccessControl: true }),
            query: `
              query FIND_ITEM_IN_CART($productId: ID!, $cartId: ID!) {
                allCartItems(where: {
                  cart: { id: $cartId }
                  item: { id: $productId }
                }){
                  id
                  quantity
                }
              }
            `,
            variables: { productId, cartId }
          })

          console.log(allCartItems)

          const [existingCartItem] = allCartItems


          if(existingCartItem) {
            console.log('this item already added')

            const { id: cartItemId, quantity: oldQuantity } = existingCartItem

            const newQuantity = oldQuantity + quantity

            const { data: { updateCartItem }, error } = await context.executeGraphQL({
              context: context.createContext({ skipAccessControl: true }),
              query: `
                mutation UPDATE_CART_ITEM($cartItemId: ID!, $newQuantity: Int!){
                  updateCartItem(
                    id: $cartItemId
                    data: { quantity: $newQuantity }
                  ){
                   id
                  }
                }
              `,
              variables: { cartItemId, newQuantity }
            })

            return updateCartItem

          } else {

            console.log('adding new item in cart')

            const { data: { createCartItem }, error } = await context.executeGraphQL({
              context: context.createContext({ skipAccessControl: true }),
              query: `
                mutation CREATE_CART_ITEM($productId: ID!, $quantity: Int!, $cartId: ID!) {
                  createCartItem(data: {
                    cart: { connect: { id: $cartId } }
                    item: { connect: { id: $productId } }
                    quantity: $quantity
                  }){
                    id                     
                  }
                }
              `,
              variables: { productId, quantity, cartId }
             })

            return createCartItem
          }
        }
      },
    },
    {
      schema: 'checkContext: SuccessMessage',
      resolver: async (_,__,context) => {
        console.log(context.req.session)
      }
    },
    {
      schema: 'removeFromCart(cartItemId: ID!): SuccessMessage',
      resolver: async (_, { cartItemId }, context) => {

        // const { id: userId } = context.authedItem;
        // console.log(userId)

        console.log(cartItemId)

       const { data } = await context.executeGraphQL({
        context: context.createContext({ skipAccessControl: true }),
        query: `
          mutation REMOVE_CART_ITEM($cartItemId: ID!) {
            deleteCartItem(id: $cartItemId) {
              id
            }
          }
        `,
        variables: { cartItemId }
       })

       console.log(data)

          return { success: true }
      },
    },
    {
      schema: 'changeCartItemQuantity(cartItemId: ID!, newQuantity: Int!): CartItem',
      resolver: async (_, args, context) => {

        // const { id: userId } = context.authedItem;
        // console.log(userId)

        console.log(args)

       const { data } = await context.executeGraphQL({
        context: context.createContext({ skipAccessControl: true }),
        query: `
          mutation UPDATE_CARTITEM_QUANTITY($cartItemId: ID!, $newQuantity: Int!){
            updateCartItem(
              id: $cartItemId
              data: { quantity: $newQuantity }
            ){
              quantity
            }
          }
        `,
        variables: args
       })

        console.log(data)

        return data?.updateCartItem
      },
    },
    {
      schema: 'sendEmail(email: String!, message: String!): SuccessMessage',
      resolver: async (_, { email, message }) => {
        console.log(email)

//         const createTransporter = async () => {
//           const oauth2Client = new OAuth2(
//             process.env.GMAIL_CLIENT_ID,
//             process.env.GMAIL_CLIENT_SECRET,
//             "https://developers.google.com/oauthplayground"
//           )
// 
//           await oauth2Client.setCredentials({
//             refresh_token: process.env.GMAIL_REFRESH_TOKEN
//           })
// 
//           const accessToken = await new Promise((resolve, reject) => {
//             oauth2Client.getAccessToken((err, token) => {
//               if (err) {
//                 reject("Failed to create access token :(");
//               }
//               resolve(token)
//             })
//           })
// 
//           const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//               type: "OAuth2",
//               user: process.env.GMAIL_EMAIL,
//               accessToken,
//               // accessToken: process.env.GMAIL_ACCESS_TOKEN,
//               clientId: process.env.GMAIL_CLIENT_ID,
//               clientSecret: process.env.GMAIL_CLIENT_SECRET,
//               refreshToken: process.env.GMAIL_REFRESH_TOKEN
//             }
//           })

        // method:-2
        // link - https://github.com/tcanbolat/Nodemailer-with-Gmail-and-OAuth2-Cheat-Sheet/blob/master/app.js

//         let transporter = nodemailer.createTransport({
//           host: "smtp.gmail.com",
//           port: 465,
//           secure: true,
//           auth: {
//            type: "OAuth2",    // defining the authentication type
//            clientId: process.env.GMAIL_CLIENT_ID,    // this will be obtained in part 2
//            clientSecret: process.env.GMAIL_CLIENT_SECRET,    // this will be obtained in part 2
//           }
//         })
// 
//          let mailOptions = {
//           from: 'venera web',   // You can change this to whatever you like. !this is NOT where you add in the email address!
//           to: email,    // Use your same googele email ("send yourself an email") to test if the app works.
//           subject: 'login otp',   // change the subject to whatever you like.
//           html: message,   // this is the output variable defined earlier that contains our message.
//           auth: {
//            user: process.env.GMAIL_EMAIL,   // replace this with your google email
//            refreshToken:  process.env.GMAIL_REFRESH_TOKEN,    // this will be obtained in part 2 
//            accessToken: process.env.GMAIL_ACCESS_TOKEN,    // this will be obtained in part 2 
//            expires: new Date().getTime(),  // this will request a new token each time so that it never expires. google allows up to 10,000 requests per day for free.
//          },
//         }
// 
// 
//   transporter.sendMail(mailOptions, (error, info) => {  
//     if (error) {
//       console.log(error);   // if anything goes wrong an error will show up in your terminal.
//     } else {
//         console.log("Message sent: %s", info.messageId);    // if it's a success, a confirmation will show up in your terminal.
//       }
//   })



        //   return transporter
        // }


        const transport = {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD
          }
        }

        const transporter = nodemailer.createTransport(transport)

        transporter.verify((error, success) => {
          if(error) {
            //if error happened code ends here
            console.error(error)
          } else {
            //this means success
            console.log('users ready to mail myself')
          }
        })

        const res = await transporter.sendMail({
          from: process.env.GMAIL_EMAIL,
          to: email,
          subject: 'login attempt',
          text: `
          from: ${process.env.GMAIL_EMAIL} 

          contact: ${process.env.GMAIL_EMAIL}

          message:

          ${message}

          `
        }).catch(err => {
            console.log(err);
            throw new Error(err.message);
          })

//         const sendEmail = async (emailOptions) => {
//           let emailTransporter = await createTransporter({ sendmail: true });
//           // await emailTransporter.sendMail(emailOptions);
//           try {
//             emailTransporter.sendMail(emailOptions);
//           } catch (err) {
//             console.log(err)
//           }
//         };
// 
//         const res = sendEmail({
//           subject: 'Login attempt',
//           text: `${message}`,
//           to: email,
//           from: process.env.GMAIL_EMAIL
//         })
//         .then(res => console.log(res))
//         .catch(err => {
//           console.log(err);
//           throw new Error(err.message);
//         })

        console.log(res)
        return { success: !!res }
      }
    },
    {
      schema: 'createAccountWithOTP(name: String, email: String!, password: String!): SuccessMessage',
      resolver: async function (_, args, context) {

        // authenticator.options = { step: 300 }

        const secret = authenticator.generateSecret()
        // console.log(secret)
        // const token = authenticator.generate(secret)
        // console.log(token)
        // const isValid = authenticator.check(token, secret)
        // console.log(isValid)

        // const opts = authenticator.allOptions()
        // console.log(opts)

//         const TimeUsed = authenticator.timeUsed(); // or totp.timeUsed();
//         const TimeRemained = authenticator.timeRemaining()
// 
//         console.log(TimeUsed)
//         console.log(TimeRemained)
// 
//         console.log(typeof context.startAuthedSession)

        const { data, errors } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `
            mutation CREATE_ACCOUNT_WITH_OTP($name: String, $email: String!, $password: String!, $secret: String){
              createUser(data: {
                name: $name
                email: $email
                password: $password
                secret: $secret
              }) {
                id
                name
                email
                secret
              }
            }
          `,
          variables: { ...args, secret },
        })

        console.log(errors)
        console.log(data)

      }
    },
    {
      schema: 'loginWithOTP(email: String!, role: ID!): SuccessMessage',
      resolver: async (_, args, context) => {

        console.log(args)
        
        const FindAdminOrEmployee = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `
            query FIND_USER($email: String!, $role: ID!){
              allUsers(where: {
                AND: [
                  { role_every: { id: $role }}
                  { email: $email }
                ]
              }){
                id
                name
                email
                secret
              }
            }
          `,
          variables: args,
        })

        console.log(FindAdminOrEmployee)

        const { id: userId, email: queriedEmail, secret: queriedSecret } = FindAdminOrEmployee?.data?.allUsers[0]

        authenticator.options = { step: 300 }

        if (queriedSecret) {

          const token = authenticator.generate(queriedSecret)
          console.log(token)

          const message = `Your login token is ${token}`

          const SendEmailInfo = await context.executeGraphQL({
            context: context.createContext({ skipAccessControl: true }),
            query: `
              mutation SEND_AN_EMAIL($email: String!, $message: String!){
                sendEmail(
                  email: $email
                  message: $message
                ) {
                  success
                }
              }
            `,
            variables: { email: queriedEmail, message },
          })

          console.log(SendEmailInfo)

          return { success: !!SendEmailInfo.data?.sendEmail?.success }
        }
        else {
          const secret = authenticator.generateSecret()
          console.log(secret)

          const UpdateUserWithSecret = await context.executeGraphQL({
            context: context.createContext({ skipAccessControl: true }),
            query: `
              mutation UPDATE_USER_SECRET($id: ID!, $secret: String!){
                updateUser(
                  id: $id
                  data: {
                    secret: $secret
                  }
                  ){
                  id
                  secret
                }
              }
            `,
            variables: { id: userId, secret},
          })

          return { success: !!UpdateUserWithSecret.data?.updateUser?.secret }
        }
      }
    },
    {
      schema: 'verifyToken(email: String!, token: String!): SuccessMessage',
      resolver: async function (_, { email, token }, context) {

        const { data, errors } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `
            query FIND_USER($email: String!){
              allUsers(where: {
                email: $email
              }){
                id
                name
                email
                secret
              }
            }
          `,
          variables: { email },
        })

        console.log(errors)
        console.log(data)

        const { secret } = data.allUsers[0]

        const TimeUsed = authenticator.timeUsed();
        const TimeRemained = authenticator.timeRemaining()
 
        console.log(TimeUsed)
        console.log(TimeRemained)

        const isValid = authenticator.check(token, secret)
        console.log(isValid)

        return { success: isValid }
      }
    },
    {
      schema: 'checkout(token: String!, price: Float): SuccessMessage',
      resolver: async function (_, { token, price }, context) {
        const userId = context.req.session.keystoneItemId
        if (!userId) {
          throw new Error('You must be signed in before checking out')
        }
        else {
          const charge = await stripe.paymentIntents.create({
            amount: price,
            currency: 'USD',
            confirm: true,
            payment_method: token,
          }).catch(err => {
            console.log(err);
            throw new Error(err.message);
          });
          console.log(charge)
          return { success: charge.status === 'succeeded' }
        }
      }
    },
  ],
  subscriptions: [
  {
      schema: 'newOrder: Order',
      subscribe: function (parent, args, context, info) {
          return pubsub.asyncIterator(['ORDER_MADE']);
      },
      resolver: function (item, args, context, info) {
          return item;
      },
      access: true,
    },
    {
      schema: 'newMessage(senderId: ID, receiverId: ID): Message',
      subscribe: function (parent, args, context, info) {
          return pubsub.asyncIterator(['New_MESSAGE']);
      },
      resolver: function (item, args, context, info) {
        console.log(item)
          return item;
      },
      access: true,
    },
    {
      schema: 'currentLocation: Position',
      subscribe: function (parent, args, context, info) {
          return pubsub.asyncIterator(['CURRENT_LOCATION']);
      },
      resolver: function (item, args, context, info) {
        console.log(item)
          return item;
      },
      access: true,
    },
  ]
}

