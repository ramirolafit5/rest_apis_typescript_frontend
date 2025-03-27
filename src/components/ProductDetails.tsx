import { useNavigate, Form, ActionFunctionArgs, redirect, useFetcher } from "react-router-dom"
import { Product } from "../types"
import { formatCurrency } from "../utils"
import { deleteProduct } from "../services/ProductService"

type ProductDetailsProps = {
    product: Product
}

export async function action ({params} : ActionFunctionArgs){
    if(params.id !== undefined){
        await deleteProduct(+params.id) //agregamos el await para esperar que ejecute y luego redireccionar
        return redirect('/')
    }
    
}

export default function ProductDetails({product}: ProductDetailsProps) {

    //Dif entre Link y useNavigate --> Link solo se puede usar en la parte del return y useNavigate en ambas

    const navigate = useNavigate()

    const isAvailabaility = product.availability

    const fetcher = useFetcher()

    return (
            <tr className="border-b ">
                <td className="p-3 text-lg text-gray-800">
                    {product.name}
                </td>
                <td className="p-3 text-lg text-gray-800">
                    {formatCurrency(product.price)}
                </td>
                <td className="p-3 text-lg text-gray-800">
                    <fetcher.Form method="POST">
                        <button
                            type="submit"
                            name="id"
                            value={product.id}
                            className={`${isAvailabaility ? 'text-black' : 'text-red-600'} rounded-lg p-2 text-xs uppercase font-black w-full border border-black-100 hover:cursor-pointer`}
                        >
                            {isAvailabaility ? 'Disponible' : 'No Disponible'}
                        </button>
                    </fetcher.Form>
                </td>
                <td className="p-3 text-lg text-gray-800 ">
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => navigate(`/productos/${product.id}/editar`)}
                            className="bg-indigo-600 text-white rounded-lg w-full p-2 uppercase font-bold text-xs text-center"
                        >Editar</button>

                        <Form
                            className="w-full"
                            method="POST"
                            action={`productos/${product.id}/eliminar`}
                            //funcion pedida a chatgpt para no eliminar por error
                            onSubmit={(event) => {
                                const isConfirmed = window.confirm("¿Estás seguro de que quieres eliminar este producto?");
                                if (!isConfirmed) {
                                    event.preventDefault(); // Cancela el envío del formulario
                                }
                            }}
                        >
                            <input 
                                type="submit" 
                                value='Eliminar' 
                                className="bg-red-600 text-white rounded-lg w-full p-2 uppercase font-bold text-xs text-center"

                            />
                        </Form>

                    </div>
                </td>
            </tr> 
    )
}


/* Dejo esta forma por aca prq me gusto mas la otra

<Link
    to={`/productos/${product.id}/editar`}
    className="bg-indigo-600 text-white rounded-lg w-full p-2 uppercase font-bold text-xs text-center"
>Editar</Link>

*/
