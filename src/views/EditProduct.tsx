import {Link, Form, useActionData, ActionFunctionArgs, redirect, LoaderFunctionArgs, useLoaderData} from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import { getProductsById, updateProduct } from '../services/ProductService'
import { Product } from '../types'

export async function loader({params} : LoaderFunctionArgs){
    //hacemos algunos cambios obligados por los errores de undefined y que espera un number

    if(params.id !== undefined){
        const product = await getProductsById(+params.id)
        console.log(product)
        if (!product){
            //throw new Response('', {status: 404, statusText: 'No Encontrado'})
            return redirect('/')
        }
        return product
    }

    return {}
}

export async function action ({request, params} : ActionFunctionArgs){
    
    const data = Object.fromEntries(await request.formData())  //esta linea recupera los datos del form

    let error = ''
    if (Object.values(data).includes('')) {
        error = 'Todos los campos son obligatorios'
    }
    if (error.length){
        return error
    }
    if (params.id !== undefined){
        await updateProduct(data, +params.id)
        return redirect('/')
    }

}

const availabilityOptions = [
    { name: 'Disponible', value: true},
    { name: 'No Disponible', value: false}
 ]

export default function EditProduct() {

    const product = useLoaderData() as Product

    const error = useActionData() as string     //esto es para recuperar el action y poder hacer uso de él

    return (
        <>
            <div className="flex justify-between">
                <h2 className="text-4xl text-slate-400 font-black">Editar producto</h2>
                <Link
                    to="/"
                    className='rounded-md p-3 bg-indigo-600 text-sm font-bold text-white shadow-sm hover:bg-indigo-500'
                >
                    Volver a productos
                </Link>
            </div>

            {/* hacemos uso del Form importado por react-rounter-dom */}

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Form
                className="mt-10"
                method='POST'
            >
            
                <div className="mb-4">
                    <label
                        className="text-gray-800"
                        htmlFor="name"
                    >Nombre Producto:</label>
                    <input 
                        id="name"
                        type="text"
                        className="mt-2 block w-full p-3 bg-gray-50"
                        placeholder="Nombre del Producto"
                        name="name"
                        defaultValue={product.name} //para autocompletar campo
                    />
                </div>

                <div className="mb-4">
                    <label
                        className="text-gray-800"
                        htmlFor="price"
                    >Precio:</label>
                    <input 
                        id="price"
                        type="number"
                        className="mt-2 block w-full p-3 bg-gray-50"
                        placeholder="Precio Producto. ej. 200, 300"
                        name="price"
                        defaultValue={product.price} //para autocompletar campo
                    />
                </div>

                <div className="mb-4">
                    <label
                        className="text-gray-800"
                        htmlFor="availability"
                    >Disponibilidad:</label>
                    <select 
                        id="availability"
                        className="mt-2 block w-full p-3 bg-gray-50"
                        name="availability"
                        defaultValue={product?.availability.toString()}
                    >
                        {availabilityOptions.map(option => (
                        <option key={option.name} value={option.value.toString()}>{option.name}</option>
                        ))}
                    </select>
                </div>

                <input
                type="submit"
                className="mt-5 w-full bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
                value="Registrar Producto Actualizado"
                />
            </Form>

        </>
    )
}
