import { useContext, useEffect, useState } from "react";
import { Container } from "../../components/container/Container";
import { PainelHeader } from "../../components/painelheader/PainelHeader";
import { AuthContext } from "../../contexts/AuthContext";
import { type CarProps } from "../home";
import { supabase } from "../../services/supabaseClient";
import { Link } from "react-router";



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

    return (
        <div>
            <Container>
                <PainelHeader />

                <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 my-14">
                {cars.map((item: CarProps) => (
                    <Link key={item.id} to={`/car/${item.id}`} >
                        <section  className="w-full bg-white rounded-lg">

                            <div
                                style={{display: loadingImage.includes(item.id) ? "none" : "block"}}
                                className="max-w-full h-72 bg-slate-200 rounded-lg">

                            </div>
                            <img
                                src={item.images?.[0]?.publicUrl || "placeholder"}
                                alt="bmw 320i"
                                className="w-full rounded-lg  mb-2 h-72 max-h-72 object-cover hover:scale-105"
                                onLoad={()=> handleLoading(item.id) }
                                style={{display: loadingImage.includes(item.id)? "block" : "none"}}
                            />


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
                    </Link>
                ))}
            </main>


            </Container>
        </div>
    )
}