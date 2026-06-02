import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { Prisma } from "@/prisma/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        const user = await getCurrentUser()
        if(!user){
            return NextResponse.json({
                error:"You are not authorized to access"
            },{
                status:401
            })
        }

        const searchParams = req.nextUrl.searchParams
        const teamId = searchParams.get("teamId")
        const role = searchParams.get("role")

        const where:Prisma.UserWhereInput = {}
        if(user.role === Role.ADMIN){

        }else if (user.role === Role.MANAGER){
            where.OR = [{teamId:user.teamId}, {role:Role.USER}]
        } else {
            where.teamId = user.teamId
            where.role = {not:"ADMIN"}
        }


        if(teamId){
            where.teamId = teamId
        }
        if(role){
            where.role = role
        }

        const users = await prisma.user.findMany({
            where,
            select:{
                id:true,
                email:true,
                name:true,
                role:true,
                team:{
                    select:{
                        id:true,
                        name:true
                    }
                },
                createdAt:true,
            },
            orderBy:{createdAt:"desc"}
        })


        return NextResponse.json(users)
    } catch (error) {
        console.error("error", error)
        return NextResponse.json({
            error:"Internal Server Error"
        },{
            status:500
        })
    }
}