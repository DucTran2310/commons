import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ExampleState {
  data: any[]
  loading: boolean
  error: string | null
}

const initialState: ExampleState = {
  data: [],
  loading: false,
  error: null
}

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.loading = true
      state.error = null
    },
    fetchDataSuccess(state, action: PayloadAction<any[]>) {
      state.data = action.payload
      state.loading = false
    },
    fetchDataFailure(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    }
  }
})

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure } = exampleSlice.actions
export default exampleSlice.reducer