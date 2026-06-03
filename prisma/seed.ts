import { hashPassword } from "@/app/lib/auth";
import { PrismaClient, Role } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});



async function main(){
    console.log("Starting db seed")
    const teams = await Promise.all([
        prisma.team.create({
            data:{
                name:"Engineering",
                description:"Software development team",
                code:"ENG-2024"
            }
        }),
        prisma.team.create({
            data:{
                name:"Marketing",
                description:"Marketing sales teams",
                code:"MKT-2024"
            }
        }),
        prisma.team.create({
            data:{
                name:"Operations",
                description:"Business operation team",
                code:"OPS-2024"
            }
        })
    ])



    const sampleUsers = [ 
        {
            name:"John Developer",
            email:"john@company.com",
            team:teams[0],
            role:Role.MANAGER
        },
        {
            name:"Jane Designer",
            email:"jane@company.com",
            team:teams[0],
            role:Role.USER
        },
        {
            name:"Joe Doe",
            email:"joedoe@company.com",
            team:teams[1],
            role:Role.GUEST
        }
    ]

    for (const userData of sampleUsers){
        await prisma.user.create({
            data:{
                email:userData.email,
                name:userData.name,
                password:await hashPassword("123456"),
                role:userData.role,
                teamId:userData.team.id
            }
        })
    }


    console.log("DB seeded successfully")
}

main()
.catch((e)=>{
    console.error("Seeding failed", e)
    process.exit(1)
}).finally(async()=>{
    await prisma.$disconnect()
})