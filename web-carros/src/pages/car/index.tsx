import { Container } from "../../components/container/Container";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { type CarProps } from "../home";
import { supabase } from "../../services/supabaseClient";
import { FaWhatsapp } from "react-icons/fa";


import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper-bundle.css'
import { Navigation, Pagination } from "swiper/modules";
import './index.css'

export function CarDetails() {
    const {id} = useParams()
    const [car, setCar] = useState<CarProps>()

    useEffect(()=> {
        async function getData(){
            const {data, error} = await supabase
                .from('cars')
                .select('*')
                .eq('id', id)

            if(error){
                console.log(error.message)
                return
            }

            const carDetails = {
                ...data[0],
                description: data[0].description,
                marca: data[0].marca,
                whatsapp: data[0].whatsapp
            }

           
            
            console.log(carDetails)
            setCar(carDetails)

        }

        getData()
    },[id])


    return (
            <Container>
                
                <Swiper
                    className="mb-8"
                    slidesPerView={1}
                    pagination={{clickable: true}}
                    navigation
                    modules={[Pagination, Navigation]}
                    breakpoints={{
                        768: {
                            slidesPerView: 2,
                            
                        }
                    }}
                    >
                        {car?.images?.map(img => (
                            <SwiperSlide key={img.name}>
                                <img src={img.publicUrl} alt="img" className="w-full  max-h-80 md:min-h-70 md:max-h-90 object-cover" />
                            </SwiperSlide>
                        ))}

                </Swiper>

                

                

                <div className="flex h-1/2  flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <strong className="text-2xl">{car?.marca.toUpperCase()} {car?.name.toUpperCase()}</strong>
                        <strong className="text-2xl">{Number(car?.value).toLocaleString('pt-BR', {
                            style: "currency",
                            currency: "BRL"
                        })}</strong>
                    </div>

                    <p className="font-thin">{car?.model}</p>

                    <div className="flex gap-6">
                        <div className="flex flex-col">
                            <p>Cidade</p>
                            <strong>{car?.city}</strong>
                        </div>
                        <div>
                            <p>Ano</p>
                            <strong>{car?.year}</strong>
                        </div>
                        <div>
                            <p>Câmbio</p>
                            <strong>{car?.cambio}</strong>
                        </div>
                        <div>
                            <p>KM</p>
                            <strong>{Number(car?.km).toLocaleString('pt-BR')}</strong>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <strong>Descrição</strong>
                        <span className="break-words whitespace-normal">{car?.description}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <strong>Telefone</strong>
                        <span>{car?.whatsapp}</span>
                    </div>

                    <div className="h-20 md:hidden"></div> {/* espaço para o botão no mobile */}


                    <div className="md:static md:px-0 fixed bottom-3 left-0 w-full px-4 ">
                        <a className="bg-green-700 flex items-center justify-center gap-2 w-full p-4 rounded-lg text-lg text-white font-medium cursor-pointer">
                        Falar com o anunciante
                        <FaWhatsapp size={26} color="#FFF" />
                    </a>
                    </div>
                </div>
            </Container>
        
    )
}