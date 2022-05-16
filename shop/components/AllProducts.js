
import { useState, useRef, useEffect } from 'react'
import { IoCartOutline } from 'react-icons/io5'
import { FiFilter } from 'react-icons/fi'
import styled from 'styled-components'
import { gql, useQuery } from '@apollo/client'
import CustomSelect from '../components/CustomSelect'
import DualRange from '../components/DualRange'
import{ useLocalState } from '../components/LocalState'
import useWindowSize from '../hooks/useWindowSize'
import ScrollBar from './ScrollBarContainer.js'
import { useAuth } from '../lib/authentication'
import ProductCard from './ProductCard'
import CustomSelect2 from './CustomSelect2'


const ALL_PRODUCTS_QUERY = gql`
	query ALL_ITEMS_QUERY($category: String, $brand: String, $price_lte: Float, $price_gte: Float, $sortBy: [SortProductsBy!]){
	  allProducts (
	 where: {
	    AND: [
	      { category: $category },
	      { brand: $brand },
	      { price_lte: $price_lte },
      	  { price_gte: $price_gte }
	    ]
	  },
	  sortBy: $sortBy
	 ){
	  	id
	    brand
	    name
	    price
	    image {
	      id
	      publicUrl
	    }
	    details
	  }
	}
`


const FILTERS_NAME_QUERY = gql`
	{
	  allProducts {
	    brand
	    category
	    price
	  }
	}
`

const AllProductsLayout = styled.div`
	width: 100%;
	height: 100%;
`

const FiltersAndSorting = styled.div`
	width: 100%;
	height: 60px;
	display: flex;
	box-shadow: 0 2px 3px rgba(0,0,0,0.15);
	@media (max-width: 900px) {
		display: none;
	}
`

const Brand = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
`

const Category = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
`

const PriceRange = styled.div`
	flex: 1.5;
	display: flex;
	justify-content: center;
	align-items: center;
	display: flex;
`

const Sorting = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
`

const Products = styled.div`
	width: 100%;
	height: calc(100% - 60px);
`

const Icons = styled.div`
	position: absolute;
	width: 100%;
	height: 30px;
	display: flex;
	flex-direction: row-reverse;
	z-index: 999999;
`

const FiltersAndSortingForSmallScreens = styled.div`
	width: 100%;
	height: auto;
	svg {
		width: 100px;
		float: right;
	}
`

const FilterBar = styled.div`
	width: 300px;
	height: 500px;
	background-color: yellowgreen;
	position: fixed;
	z-index: 9999;
	transition: left .3s ease-in-out;
`

export default function AllProducts() {
	const { width, height } = useWindowSize()
	const { SaveToLocalStorage, setCartOpen, addToCart } = useLocalState()
	const [filterOpen, setFilterOpen] = useState(false)
	const [filterVariables, setFilterVariables] = useState({
		brand: undefined,
		category: undefined,
		price_lte: undefined,
		price_gte: undefined,
		sortBy: undefined
	})

	const { data: FNQData, error: FNQError, loading: FNQLoading } = useQuery(FILTERS_NAME_QUERY)
	const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY, { variables: filterVariables })

	// if (typeof FNQData === 'undefined') {
	// 	return null
	// }

	let ProductsWBAC = FNQData && FNQData?.allProducts && FNQData?.allProducts

	let BrandNames = []
	let CategoryNames = []
	let Prices = []

	for (let i=0; i<ProductsWBAC?.length; i++) {
		BrandNames[i] = ProductsWBAC[i].brand
		CategoryNames[i] = ProductsWBAC[i].category
		Prices[i] = ProductsWBAC[i].price
	}

	const UniqueBrandNames = [... new Set(BrandNames)]
	const SortedUniqueBrandNames = UniqueBrandNames.sort()
	const UniqueCategoryNames = [... new Set(CategoryNames)]
	const MinimumPrice = Math.min( ...Prices )
	const MaximumPrice = Math.max( ...Prices )

	var FilteredSortedUniqueBrandNames = SortedUniqueBrandNames.filter(n => n)
	var FilteredUniqueCategoryNames = UniqueCategoryNames.filter(n => n)

	function handleChange({ name, value }) {
		setFilterVariables({ ...filterVariables, [name]: value })
	}

	const SortingOptionsAndValues = [{option: 'Price low to high', value: 'price_ASC'}, {option: 'Price high to low', value: 'price_DESC'},  {option: 'A-Z', value: 'name_ASC'},  {option: 'Z-A', value: 'name_DESC'}]
	
	console.log(FilteredSortedUniqueBrandNames)

	return (
		<AllProductsLayout>
			{ !FNQLoading ? (
				<FiltersAndSorting>
					<Brand>
						{/* <CustomSelect name="brand" style={{width: '100px', height: '35px'}} options={FilteredSortedUniqueBrandNames} header="All Brands" onSelect={handleChange}/> */}
						{/* <CustomSelect2 options={FilteredSortedUniqueBrandNames}/> */}
					</Brand>
					<Category>
						{/* <CustomSelect name="category" style={{width: '120px', height: '35px'}} options={FilteredUniqueCategoryNames} header="All Categories"  onSelect={handleChange}/> */}
						{/* <CustomSelect name="category" style={{width: '120px', height: '35px'}}/> */}
					</Category>
					<PriceRange>
						<DualRange min={MinimumPrice} max={MaximumPrice} onChange={ data => setFilterVariables({...filterVariables, price_gte: data.minValue, price_lte: data.maxValue})}/>
					</PriceRange>
					<Sorting>
						{/* <CustomSelect name="sortBy" style={{width: '130px', height: '35px'}} options={SortingOptionsAndValues} onSelect={handleChange}/> */}
					</Sorting>
				</FiltersAndSorting>
			) : null }
			<Products>
				<ScrollBar>
					{data?.allProducts.map(product => (
						<ProductCard key={product.id} data={product}/>
					))}
				</ScrollBar>
			</Products>
		</AllProductsLayout>
	)
}