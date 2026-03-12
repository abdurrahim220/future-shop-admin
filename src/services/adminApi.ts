
import type { ApiResponse } from '@/types/apiResponse'
import type { IUser } from '@/types/userTypes'
import config from '@/utils/config'
import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react'



export const adminApi = createApi({
    reducerPath:"adminApi",
    baseQuery:fetchBaseQuery({baseUrl:`${config.apiBaseUrl}/admin`,
        credentials:"include"
    }),
    endpoints:(builder)=>({
        getAllUsers:builder.query<ApiResponse<IUser[]>,void>({
            query:()=>({
                url:"/",
                method:"GET",
                headers:{
                    "Content-Type":"application/json"
                }
            })
        })
    })
})