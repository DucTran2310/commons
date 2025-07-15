import { combineReducers } from '@reduxjs/toolkit'
import exampleReducer from '@/store/features/examples/example.slices'

const rootReducer = combineReducers({
  example: exampleReducer,
  // Thêm các reducer khác ở đây
})

export default rootReducer