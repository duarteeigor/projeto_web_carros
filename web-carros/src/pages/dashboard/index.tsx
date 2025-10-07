import { useContext, useEffect, useState } from "react";
import { Container } from "../../components/container/Container";
import { PainelHeader } from "../../components/painelheader/PainelHeader";
import { AuthContext } from "../../contexts/AuthContext";
import { type CarProps } from "../home";
import { supabase } from "../../services/supabaseClient";
import toast from "react-hot-toast";
import { Card } from "../../components/card";

export function capitalizeWords(text: string) {
        return text
            .toLowerCase()
            .split(" ")
            .filter(word => word.trim() !== "")
            .map(word => word[0].toUpperCase() + word.substring(1))
            .join(" ")
    }



export function Dashboard() {
    const { user } = useContext(AuthContext)
    const [cars, setCars] = useState<CarProps[]>([])

    useEffect(() => {
        async function getData() {
            if (!user) {
                return
            }

            const response = await supabase
                .from('cars')
                .select('*')
                .eq('owner_id', user.id)

            if (response.error) {
                console.error(response.error.message)
                return
            }

            // const carsWithImages = response.data.map(car=> {
            //     return{
            //         ...car,
            //         image: car.images || []
            //     }
            // })


            setCars(response.data)

        }

        getData()
    }, [user])

    async function handleDelete(car: CarProps) {
        //removendo o carro cadastrado no banco de dados
        const response = await supabase
            .from('cars')
            .delete() //.select('*')
            .eq('id', car.id)

        if (response.error) {
            console.error(response.error.message)
            return
        }

        //Caso queira dar um console no data que foi excluido, é necessario passar um select na response apos o metodo delete, caso contrario retornara null
        // console.log("excluiu do db", response.data) === null

        //excluindo imagens do carro deletado no storage

        car.images?.map(async (img) => {
            //pegando a url (car.owner_id/img.name) que vem do newDashboard
            const path = img.url

            try {
                const { error } = await supabase.storage
                    .from('car_images')
                    .remove([path])

                if (error) {
                    console.error(error.message)
                    return
                }


            } catch (erro) {
                console.error(erro)
            }
        })

        toast.success("Carro excluído com sucesso!")
        //Atualiazndo o state para remover o carro que foi deletado
        setCars(cars.filter(item => item.id !== car.id))
    }


    return (
        <div>
            <Container>
                <PainelHeader />

                <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 my-14">
                    {user && cars.map((item: CarProps) => (

                        <section key={item.id} className="w-full bg-white rounded-lg">
                            <Card item={item} onDelete={handleDelete} />
                            
                        </section>

                    ))}
                </main>


            </Container>
        </div>
    )
}