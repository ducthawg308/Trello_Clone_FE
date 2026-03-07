import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI } from '~/apis'

const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '69aa451d78b678a83a96f36e'

    fetchBoardDetailsAPI(boardId).then((board) => {
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

  const moveColumns = async (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    setBoard(prev => ({
      ...prev,
      columns: dndOrderedColumns,
      columnOrderIds: dndOrderedColumnsIds
    }))

    await updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnsIds })
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
      />
    </Container>
  )
}

export default Board
