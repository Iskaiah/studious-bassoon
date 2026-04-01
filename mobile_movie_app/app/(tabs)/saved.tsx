import {View, Text, Image, FlatList, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react'
import {images} from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import {icons} from "@/constants/icons";
import {getSavedMovies} from "@/services/appwrite";

const Saved = () => {
    const {
        data: movies,
        loading,
        error,
    } = useFetch(() => getSavedMovies());

    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="absolute w-full z-0" />

            <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                className="px-5"
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: 'center',
                    gap: 16,
                    marginVertical: 16
                }}
                contentContainerStyle={{ paddingTop: 100 }}
                ListHeaderComponent={
                    <>
                        <View className="w-full flex-row justify-center mt-20 items-center">
                            <Image source={icons.logo} className="w-12 h-10" />
                        </View>

                        <Text className="text-xl text-white font-bold my-5">
                            Saved Movies
                        </Text>

                        {loading && (
                            <ActivityIndicator
                                size="large"
                                color="#0000ff"
                                className="my-3"
                            />
                        )}
                        {error && (
                            <Text className="text-red-500 px-5 my-3">
                                Error: {error.message}
                            </Text>
                        )}
                    </>
                }
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-gray-500">
                                No saved movies yet
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
};

export default Saved;