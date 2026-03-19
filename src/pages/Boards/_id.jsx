import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { useEffect } from 'react'
import { updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI } from '~/apis'
import { fetchBoardDetailsAPI, selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { selectCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

const Board = () => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const activeCard= useSelector(selectCurrentActiveCard)

  const { boardId } = useParams()
  useEffect(() => {
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    const newBoard = {
      ...board,
      columns: dndOrderedColumns,
      columnOrderIds: dndOrderedColumnsIds
    }

    dispatch(updateCurrentActiveBoard(newBoard))

    updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = {
      ...board,
      columns: board.columns.map(column =>
        column._id === columnId
          ? {
              ...column,
              cards: dndOrderedCards,
              cardOrderIds: dndOrderedCardIds
            }
          : column
      )
    }

    dispatch(updateCurrentActiveBoard(newBoard))

    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    const newBoard = {
      ...board,
      columns: dndOrderedColumns,
      columnOrderIds: dndOrderedColumnsIds
    }

    dispatch(updateCurrentActiveBoard(newBoard))

    updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnsIds })

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      nextColumnId,
      prevCardOrderIds: dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <PageLoadingSpinner caption="Loading Board..."/>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh'}}>
      {/* Modal active card, check đóng mở dựa theo điều kiện có tồn tại data activeCard lưu trong Redux hay không thì mới render. Mỗi thời điểm chỉ tồn tại một cái Modal Card đang Active */}
      {activeCard && <ActiveCard/>}
      
      {/* Các thành phần còn lại của Board */}
      <AppBar/>
      <BoardBar board={board}/>
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
