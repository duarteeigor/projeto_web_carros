import { useContext, useEffect, useState } from "react";
import { Container } from "../../components/container/Container";
import { PainelHeader } from "../../components/painelheader/PainelHeader";
import { AuthContext } from "../../contexts/AuthContext";
import { type CarProps } from "../home";
import { supabase } from "../../services/supabaseClient";
import { Link } from "react-router";
import { FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";



export function Dashboard() {
    const { user } = useContext(AuthContext)
    const [cars, setCars] = useState<CarProps[]>([])
    const [loadingImage, setLoadingImage] = useState<string[]>([])

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
                console.log(response.error.message)
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

    function handleLoading(id: string) {
        setLoadingImage(prev => [...prev, id])
    }

    async function handleDelete(car: CarProps) {
        //removendo o carro cadastrado no banco de dados
        const response = await supabase
            .from('cars')
            .delete() //.select('*')
            .eq('id', car.id)

        if (response.error) {
            console.log(response.error.message)
            return
        }

        //Caso queira dar um console no data que foi excluido, é necessario passar um select na response apos o metodo delete, caso contrario retornara null
        // console.log("excluiu do db", response.data) === null

        //excluindo imagens do carro deletado no storage

        car.images?.map(async (img) => {
            //pegando a url (car.owner_id/img.name) que vem do newDashboard
            const path = img.url

            try {
                const { data, error } = await supabase.storage
                    .from('car_images')
                    .remove([path])

                if (error) {
                    console.log(error.message)
                    return
                }


            } catch (erro) {
                console.log(erro)
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
                    {cars.map((item: CarProps) => (

                        <section key={item.id} className="w-full bg-white rounded-lg">

                            <div className="relative w-full h-72 rounded-lg overflow-hidden group">
                                <div
                                    style={{ display: loadingImage.includes(item.id) ? "none" : "block" }}
                                    className="max-w-full h-72 bg-slate-200 rounded-lg">

                                </div>

                                <Link to={`/car/${item.id}`}>
                                    <img
                                        src={item.images?.[0]?.publicUrl || "placeholder"}
                                        alt="bmw 320i"
                                        className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105"
                                        onLoad={() => handleLoading(item.id)}
                                        style={{ display: loadingImage.includes(item.id) ? "block" : "none" }}
                                    />
                                </Link>


                                <FiTrash2
                                    size={28}
                                    color="#FFF"
                                    className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={(e) => { e.stopPropagation(), handleDelete(item) }}

                                />

                            </div>


                            <p className="font-bold mt-1 mb-2 px-2">{item.name.toUpperCase()}</p>

                            <div className="flex flex-col px-2">
                                <span className="text-zinc-700 mb-6">Ano {item.year} | {Number(item.km).toLocaleString("pt-BR")} km</span>
                                <strong className="font-medium">{Number(item.value).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                })}</strong>
                            </div>


                            <div className="w-full h-px bg-slate-200 my-2"></div>

                            <div className="px-2 pb-2">
                                <span className="text-zinc-700">{item.city}</span>
                            </div>
                        </section>

                    ))}
                </main>


            </Container>
        </div>
    )
}