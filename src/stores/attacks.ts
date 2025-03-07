import { ref } from 'vue'
import { defineStore } from 'pinia'
import { logService } from '@/services/LogService'
import {
  getCommentsService,
  addCommentsService,
  getAllItemsService,
  createItemService,
  deleteItemService,
} from '@/services/ApiService'

export const useAttackStore = defineStore('attack', () => {
  interface Comment {
    id: number
    user_id: number
    comment: string
    created_at: string
  }

  interface Item {
    id: number
    name: string
    description: string
  }

  const comments = ref<Comment[]>([])
  const items = ref<Item[]>([])

  async function getComments() {
    try {
      const response = await getCommentsService()
      comments.value = response.data
    } catch (error: unknown) {
      const errorMessage = 'Error during getComments'
      console.error(errorMessage, error)
      await logService.log('error', errorMessage, { error })
    }
  }

  async function addComment(user_id: number, comment: string) {
    try {
      const response = await addCommentsService(user_id, comment)
      comments.value.push(response.data)
    } catch (error: unknown) {
      const errorMessage = 'Error during addComments'
      console.error(errorMessage, error)
      await logService.log('error', errorMessage, { error })
    }
  }

  async function getAllItems() {
    try {
      const response = await getAllItemsService()
      items.value = response.data
    } catch (error: unknown) {
      const errorMessage = 'Error during getAllItems'
      console.error(errorMessage, error)
      await logService.log('error', errorMessage, { error })
    }
  }

  async function createItem(name: string, description: string) {
    try {
      const response = await createItemService(name, description)
      items.value.push(response.data)
    } catch (error: unknown) {
      const errorMessage = 'Error during createItem'
      console.error(errorMessage, error)
      await logService.log('error', errorMessage, { error })
    }
  }

  async function deleteItem(id: number) {
    try {
      await deleteItemService(id)
      items.value = items.value.filter((item) => item.id !== id)
    } catch (error: unknown) {
      const errorMessage = 'Error during deleteItem'
      console.error(errorMessage, error)
      await logService.log('error', errorMessage, { error })
    }
  }

  return { comments, getComments, addComment, items, getAllItems, createItem, deleteItem }
})
