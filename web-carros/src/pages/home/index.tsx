import { Container } from "../../components/container/Container";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Card } from "../../components/card";

export interface CarProps {
    id: string;
    owner_id: string;
    name: string;
    year: string;
    km: string;
    value: string;
    city: string;
    images?: CarImageProps[];
    description: string,
    marca: string,
    whatsapp: string,
    model: string,
    cambio: string
}

export interface CarImageProps {
    name: string;
    id: string;
    publicUrl: string;
    url: string
}


export function Home() {
    const [search, setSearch] = useState('')
    const [cars, setCars] = useState<CarProps[]>([])

    useEffect(() => {
        getData()
    }, [])

    async function getData() {
            const response = await supabase
                .from('cars')
                .select('*')

            if (!response.data) {
                console.error(response.error)
                return
            }

            // const carsWithImages = response.data.map(car => ({
            //     ...car,
            //     images: car.images || []
            // }));

            setCars(response.data)

        }

    async function handleSearch(){
        if(search === ""){
            getData()
            return
        }
        const {data, error} = await supabase
            .from("cars")
            .select("*")
            .ilike("name", `%${search}%`)
        
        if(error){
            console.error(error.message)
            return
        }

        if(data && data.length > 0){
            setCars(data)
        }
    }
    
    

    return (
        <Container>
            <div className="flex items-center justify-around w-full max-w-3xl h-20 mx-auto mb-6 rounded-2xl bg-white">
                <input
                    type="text"
                    placeholder="Digite o nome do carro..."
                    className="w-8/12 p-2 border border-gray-300 rounded-2xl outline-none"
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button
                    onClick={()=> handleSearch()}
                    className="w-3/12 bg-red-500 p-2 rounded-2xl text-white text-lg font-medium cursor-pointer hover:bg-red-900 transition-colors">Buscar</button>
                    

            </div>

            <h1 className="text-center text-2xl font-medium ">Carros novos e usados em todo o Brasil!</h1>

            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 my-14">
                {cars.map((item: CarProps) => (
                    
                        <section key={item.id} className="w-full bg-white rounded-lg">
                        <Card item={item} />
                            
                        </section>
                    
                ))}
            </main>
        </Container>
    )
}