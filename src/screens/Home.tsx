import { useEffect } from "react";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Alert, ScrollView, Text, View } from "react-native";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import Feather from 'react-native-vector-icons/Feather';
import colors from "tailwindcss/colors";

interface Pokemon {
    name: string;
}

interface ApiResponse {
    count: number;
    results: Pokemon[];
}

export function Home() {
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

    const itemsPerPage = 50;

    async function fetchData(limit = itemsPerPage, offset = itemsPerPage * page) {
        try {
            setLoading(true);
            const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
            setApiResponse(response.data);

            setTotalPages(Math.ceil(response.data.count / itemsPerPage))
        } catch (error) {
            Alert.alert('Ops', 'Não foi possível carregar os Pokémons.');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const onLeftClickHandler = (() => {
        if (page > 0) {
            setPage(page-1)
        }
    })

    const onRightClickHandler = (() => {
        if (page+1 !== totalPages) {
            setPage(page+1)
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
        <View className="flex-1 bg-background">

            <Header />

            <View className="flex-row justify-evenly items-center py-3">
                <Text className="text-zinc-400">
                    <Text className="text-white">{page + 1}</Text> de <Text className="text-white">{totalPages}</Text> páginas
                </Text>
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
                        page+1 !== totalPages ?
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