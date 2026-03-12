import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_ROOT } from '~/apis/environment'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'

// Khởi tạo giá trị State của một Slice trong redux
const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)

// Khởi tạo một cái Slice trong kho lưu trữ - Redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
      const board = action.payload

      // Xử lý dữ liệu nếu cần thiết ....

      // Cập nhật lại dữ liêu của currentActiveBoard
      state.currentActiveBoard = board
    }
  },
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
        // action.payload ở đây chính là response.data trả về từ API ở trên
        const board = action.payload

        // Xử lý dữ liệu nếu cần thiết ....
        board.columns.forEach((column) => {
          if (!isEmpty(column.cards)) {
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })
        board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

        // Cập nhật lại dữ liêu của currentActiveBoard
        state.currentActiveBoard = board
      })
  }
})

export const { updateCurrentActiveBoard } = activeBoardSlice.actions

export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

export const activeBoardReducer = activeBoardSlice.reducer