import { Container } from "../../components/container/Container";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { type CarProps } from "../home";
import { supabase } from "../../services/supabaseClient";
import { FaWhatsapp } from "react-icons/fa";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'
import { Navigation, Pagination } from "swiper/modules";
import './index.css'
import { capitalizeWords } from "../dashboard";

export function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarProps>();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function getData() {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id);

      if (error) {
        console.error(error.message);
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const carDetails = {
        ...data[0],
        description: data[0].description,
        marca: data[0].marca,
        whatsapp: data[0].whatsapp
      };

      setCar(carDetails);
      setLoading(false);
    }

    getData();
  }, [id]);

  useEffect(() => {
    if (notFound) {
      navigate("/", { replace: true }); // redireciona se carro não encontrado
    }
  }, [notFound, navigate]);

  if (loading) return <Container>Carregando...</Container>;

  if (!car) return null; // fallback extra, caso necessário

  return (
    <Container>
      {car.images && car.images.length > 0 && (
        <Swiper
          className="mb-8"
          slidesPerView={car.images.length > 1 ? 2 : 1}
          pagination={{ clickable: car.images.length > 1 }}
          navigation={car.images.length > 1}
          modules={[Pagination, Navigation]}
          breakpoints={{
            768: {
              slidesPerView: car.images.length > 1 ? 2 : 1,
            }
          }}
        >
          {car.images.map(img => (
            <SwiperSlide key={img.name}>
              <img
                src={img.publicUrl}
                alt="img"
                className="w-full max-h-80 md:min-h-70 md:max-h-90 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="flex h-1/2 flex-col gap-4">
        <div className="flex items-center justify-between">
          <strong className="text-2xl">{car.marca.toUpperCase()} {car.name.toUpperCase()}</strong>
          <strong className="text-2xl">{Number(car.value).toLocaleString('pt-BR', {
            style: "currency",
            currency: "BRL"
          })}</strong>
        </div>

        <p className="font-thin">{car.model}</p>

        <div className="flex gap-6">
          <div className="flex flex-col">
            <p>Cidade</p>
            <strong>{capitalizeWords(car.city)}</strong>
          </div>
          <div>
            <p>Ano</p>
            <strong>{car.year}</strong>
          </div>
          <div>
            <p>Câmbio</p>
            <strong>{car.cambio}</strong>
          </div>
          <div>
            <p>KM</p>
            <strong>{Number(car.km).toLocaleString('pt-BR')}</strong>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <strong>Descrição</strong>
          <span className="break-words whitespace-normal">{car.description}</span>
        </div>

        <div className="flex flex-col gap-2">
          <strong>Telefone</strong>
          <span>{car.whatsapp}</span>
        </div>

        <div className="h-20 md:hidden"></div> {/* espaço para botão mobile */}

        <div className="md:static md:px-0 fixed bottom-3 left-0 w-full px-4">
          <a
            className="bg-green-700 flex items-center justify-center gap-2 w-full p-4 rounded-lg text-lg text-white font-medium cursor-pointer hover:bg-green-800 transition-colors duration-200"
            href={`https://api.whatsapp.com/send?phone=${car.whatsapp}&text=Olá, vi seu anúncio sobre esse carro ${car.name} e entrei em contato.`}
            target="_blank"
          >
            Falar com o anunciante
            <FaWhatsapp size={26} color="#FFF" />
          </a>
        </div>
      </div>
    </Container>
  );
}
