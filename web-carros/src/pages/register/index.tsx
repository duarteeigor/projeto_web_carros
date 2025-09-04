import { Container } from "../../components/container/Container";
import logoImg from "../../assets/logo.svg"
import { Link, useNavigate } from "react-router";

import { Input } from "../../components/input/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { supabase } from "../../services/supabaseClient";
import { useEffect } from "react";

const schema = z.object({
    name: z.string().nonempty("Campo nome obrigatório"),
    email: z.email("Digite um email válido").nonempty("Campo email obrigatório"),
    password: z.string().min(6).nonempty("Campo senha obrigatório")
})

type FormData = z.infer<typeof schema>

export function Register() {
    const navigate = useNavigate()

    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    useEffect(()=>{
        async function signOut(){
            const {error} = await supabase.auth.signOut()
            
            if(error){
                console.log(error.message)
            } else {
                console.log("Usuario deslogado com sucesso")
            }
        }
        signOut()
    },[])

    async function onSubmit(data: FormData){
        const {email, password, name} = data

        try {
            const {data: sessionData,  error} = await supabase.auth.signUp(
                {
                    email: email, 
                    password: password,
                    options: {
                        data:{
                            name: name
                        }
                    }
                }
            )

            if(error){
                console.log(error)
            } else {
                console.log("Registrado com sucesso!")
                navigate("/login")
            }
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <Container>
            <div className="w-full min-h-screen flex flex-col justify-center items-center gap-4 ">
                <Link to="/" className="mb-6 max-w-sm w-full">
                    <img
                        src={logoImg}
                        alt="logo image"
                        className="w-full"
                    />
                </Link>

                <form className="bg-white w-full max-w-xl p-4 rounded-lg flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        name="name"
                        type="text"
                        placeholder="Digite o seu nome..."
                        error={errors.name?.message}
                        register={register}
                    />
                     <Input
                        name="email"
                        type="email"
                        placeholder="Digite o email"
                        error={errors.email?.message}
                        register={register}
                    />

                    <Input
                        name="password"
                        type="password"
                        placeholder="Digite a senha..."
                        error={errors.password?.message}
                        register={register}
                    />

                    <button type="submit" className="w-full h-10 p-2 bg-black rounded-lg text-white font-medium">Acessar</button>
                </form>
                
                <span className="my-8">Já possui uma conta?<Link to="/login"> Clique aqui!</Link></span>

            </div>
        </Container>
    )
}