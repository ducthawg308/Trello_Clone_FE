import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI } from '~/apis'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Typography } from '@mui/material'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'

const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '69aa451d78b678a83a96f36e'

    fetchBoardDetailsAPI(boardId).then((board) => {
      board.columns.forEach((column) => {
        if (!isEmpty(column.cards)) {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      setBoard(board)
    })
  }, [])

  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    setBoard(prev => ({
      ...prev,
      columns: [...prev.columns, createdColumn],
      columnOrderIds: [...prev.columnOrderIds, createdColumn._id]
    }))
  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    
    setBoard(prev => ({
      ...prev,
      columns: prev.columns.map(column =>
        column._id === createdCard.columnId
          ? {
              ...column,
              cards: [...column.cards, createdCard],
              cardOrderIds: [...column.cardOrderIds, createdCard._id]
            }
          : column
      )
    }))
  }

  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    setBoard(prev => ({
      ...prev,
      columns: dndOrderedColumns,
      columnOrderIds: dndOrderedColumnsIds
    }))

    updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    setBoard(prev => ({
      ...prev,
      columns: prev.columns.map(column =>
        column._id === columnId
          ? {
              ...column,
              cards: dndOrderedCards,
              cardOrderIds: dndOrderedCardIds
            }
          : column
      )
    }))

    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    setBoard(prev => ({
      ...prev,
      columns: dndOrderedColumns,
      columnOrderIds: dndOrderedColumnsIds
    }))

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
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress/>
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh'}}>
      <AppBar/>
      <BoardBar board={board}/>
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
