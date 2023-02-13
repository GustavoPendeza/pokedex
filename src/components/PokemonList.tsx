import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "../lib/axios";
import { Card } from "./Card";
import { Loading } from "./Loading";
import Feather from 'react-native-vector-icons/Feather';
import colors from "tailwindcss/colors";

interface Pokemon {
    name: string;
}

interface ApiResponse {
    count: number;
    results: Pokemon[];
}

export function PokemonList() {
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

    const itemsPerPage = 20;

    /**
     * Retorna uma lista de Pokémons com paginação baseada no limit e offset
     * 
     * @param limit Limite de Pokémons carregados por página
     * @param offset A partir de qual Pokémon aquela página começa a ser carregada
     */
    async function fetchData(limit = itemsPerPage, offset = itemsPerPage * page) {
        try {
            setLoading(true);
            const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
            setApiResponse(response.data);

            setTotalPages(Math.ceil(response.data.count / itemsPerPage))
        } catch (error) {
            Alert.alert(':(', 'Não foi possível carregar os Pokémons.');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Retorna a página digitada pelo usuário
     * 
     * @param pageNumber Número da página
     */
    const onSubmitPageHandler = ((pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setPage(pageNumber-1)
        } else {
            Alert.alert("Ops", "Essa página não existe. Verifique se digitou corretamente.")
        }
        
    })

    /**
     * Volta uma página
     */
    const onLeftClickHandler = (() => {
        if (page > 0) {
            setPage(page - 1)
        }
    })

    /**
     * Avança uma página
     */
    const onRightClickHandler = (() => {
        if (page + 1 !== totalPages) {
            setPage(page + 1)
        }
    })

    useEffect(() => {
        fetchData();
    }, [page]);

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className="flex-1">
            <View className="flex-row justify-evenly items-center py-3">
                <Text className="text-zinc-400">
                    <Text className="text-white">{page + 1}</Text> de <Text className="text-white">{totalPages}</Text> páginas
                </Text>

                <TextInput 
                    className="border border-zinc-500 rounded-lg w-1/3 text-white p-2" 
                    keyboardType="number-pad"
                    placeholder="Digite a página" 
                    placeholderTextColor={colors.zinc[400]} 
                    onSubmitEditing={(event) => onSubmitPageHandler(Number(event.nativeEvent.text))}
                    clearButtonMode={"always"}
                />

                <View className="flex-row gap-x-6">
                    {
                        page !== 0 ?
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={onLeftClickHandler}
                                className="ml-2"
                            >
                                <Feather name="arrow-left" size={32} color={colors.white} />
                            </TouchableOpacity>
                            :
                            <Feather name="arrow-left" size={32} color={colors.zinc[400]} />
                    }
                    {
                        page + 1 !== totalPages ?
                            <TouchableOpacity activeOpacity={0.7} onPress={onRightClickHandler} className="ml-2">
                                <Feather name="arrow-right" size={32} color={colors.white} />
                            </TouchableOpacity>
                            :
                            <Feather name="arrow-right" size={32} color={colors.zinc[400]} />
                    }
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-row flex-wrap justify-between px-5 pb-5 pt-1">
                    {
                        apiResponse && apiResponse.results.map((pokemon, index) => (
                            <Card
                                key={index}
                                name={pokemon.name}
                            />
                        ))
                    }
                </View>
            </ScrollView>
        </View>
    )
}