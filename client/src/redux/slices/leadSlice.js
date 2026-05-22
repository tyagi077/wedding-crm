import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  leads: [],
  loading: false,
  error: null,
}

export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (_, thunkAPI) => {
    try {

      const response = await api.get('/leads')

      return response.data

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      )

    }
  }
)

const leadSlice = createSlice({
  name: 'leads',

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(fetchLeads.pending, (state) => {
        state.loading = true
      })

      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false
        state.leads = action.payload
      })

      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

  }
})

export default leadSlice.reducer