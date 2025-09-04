import { Container } from "../../components/container/Container";
import logoImg from "../../assets/logo.svg"
import { Link } from "react-router";

import { Input } from "../../components/input/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    name: z.string().nonempty("Campo nome obrigatório"),
    email: z.email("Digite um email válido").nonempty("Campo email obrigatório"),
    password: z.string().min(6).nonempty("Campo senha obrigatório")
})

type FormData = z.infer<typeof schema>

export function Register() {
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    function onSubmit(data: FormData){
        console.log(data)
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
                
                <span className="my-8">Já possui uma conta?<a href="/register"> Clique aqui!</a></span>

            </div>
        </Container>
    )
}