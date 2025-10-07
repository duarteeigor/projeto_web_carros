import { useState } from "react"
import type { CarProps } from "../../pages/home"
import { capitalizeWords } from "../../pages/dashboard"
import { Link, useLocation } from "react-router"
import { FiTrash2 } from "react-icons/fi"

interface CardProps {
    item: CarProps,
    onDelete?: (car: CarProps) => void
}

export function Card({ item, onDelete }: CardProps) {
    const [loadingImage, setLoadingImage] = useState<string[]>([])
    const location = useLocation()

    const isDashboard = location.pathname === "/dashboard";

    function handleLoading(id: string) {
        setLoadingImage(prev => [...prev, id])
    }


    return (
        <div>
            <div className="relative w-full h-72 rounded-lg overflow-hidden group">
                <div
                    style={{ display: loadingImage.includes(item.id) ? "none" : "block" }}
                    className="max-w-full h-72 bg-slate-200 rounded-lg">

                </div>

                <Link to={`/car/${item.id}`}>
                    <img
                        src={item.images?.[0]?.publicUrl || "placeholder"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105"
                        onLoad={() => handleLoading(item.id)}
                        style={{ display: loadingImage.includes(item.id) ? "block" : "none" }}
                    />
                </Link>


                {isDashboard && (
                    <FiTrash2
                        size={28}
                        color="#FFF"
                        className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={(e) => { e.stopPropagation(), onDelete?.(item) }}

                    />

                )}
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
                <span className="text-zinc-700">{capitalizeWords(item.city)}</span>
            </div>
        </div>
    )
}