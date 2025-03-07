import { genericRequest, genericRequestAutheticated } from '../utils/genericRequest'

const base_url = import.meta.env.VITE_ENDPOINT_API ?? 'http://localhost:3000'

const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + localStorage.getItem('token'),
}

export const sqlService = async (newItem: string) => {
  return await genericRequest(base_url + '/items', 'POST', newItem, headers)
}

export const getCommentsService = async () => {
  return await genericRequestAutheticated(headers, base_url + '/attack/xss', 'GET')
}

export const addCommentsService = async (user_id: number, comment: string) => {
  return await genericRequestAutheticated(headers, base_url + '/attack/xss', 'POST', {
    user_id,
    comment,
  })
}

// New functions for items
export const getAllItemsService = async () => {
  return await genericRequestAutheticated(headers, base_url + '/items', 'GET')
}

export const createItemService = async (name: string, description: string) => {
  return await genericRequestAutheticated(headers, base_url + '/items', 'POST', { name, description })
}

export const deleteItemService = async (id: number) => {
  return await genericRequestAutheticated(headers, base_url + `/items/${id}`, 'DELETE')
}
