import type { RegisterOptions, UseFormRegister } from "react-hook-form"

interface InputProps{
    type: string,
    placeholder: string,
    name: string,
    register: UseFormRegister<any>
    error?: string,
    rules?: RegisterOptions
}

export function Input({type, placeholder, name, error, register, rules} : InputProps){
    return(
        <div>
            <input
                className="px-2 w-full outline-none h-10 rounded-md border-2 border-gray-200 mb-2"
                placeholder={placeholder}
                type={type}
                {...register(name, rules)}
                id={name}
             />
             {error && <p className="text-red-500">{error}</p>}
        </div>
    )
}