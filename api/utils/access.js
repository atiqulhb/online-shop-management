// Access control functions
function userIsAdmin({ authentication: { item: user } }) {
  return Boolean(user && user.permissions === 'ADMIN');
}

function userOwnsItem({ authentication: { item: user } }) {
  if (!user) {
    return false;
  }
  // This returns a graphql Where object, not a boolean
  return { user: { id: user.id } };
}

 // This will check if the current user is requesting information about themselves

function userIsUser({ authentication: { item: user } }) {
  // here we return either false if there is no user, or a graphql where clause
  return user && { id: user.id };
}

function userIsAdminOrOwner(auth) {
  const isAdmin = userIsAdmin(auth);
  const isOwner = userOwnsItem(auth);
  return isAdmin || isOwner;
}

function userCanAccessUsers(auth) {
  const isAdmin = userIsAdmin(auth);
  const isThemselves = userIsUser(auth);
  return isAdmin || isThemselves;
}

function userCanUpdateItem(payload) {
  const isOwner = userOwnsItem(payload);
  const isCool = ['ADMIN', 'EDITOR'].includes(
    payload.authentication.item.permissions
  );
  return isCool || isOwner || userOwnsItem(payload);
}

module.exports = { userIsAdmin, userOwnsItem, userIsUser, userIsAdminOrOwner, userCanAccessUsers, userCanUpdateItem }
