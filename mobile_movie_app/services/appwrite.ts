import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;
const SAVED_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_TABLE_ID!;

const client = new Client()
    .setEndpoint("https://syd.cloud.appwrite.io/v1")
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.equal("searchTerm", query),
        ]);

        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];
            await database.updateDocument(
                DATABASE_ID,
                TABLE_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1,
                }
            );
        } else {
            await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                title: movie.title,
                count: 1,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
    } catch (error) {
        console.error("Error updating search count:", error);
        throw error;
    }
};

export const getTrendingMovies = async (): Promise<
    TrendingMovie[] | undefined
> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
        ]);

        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export const saveMovie = async (movie: SavedMovie): Promise<void> => {
    try {
        await database.createDocument(DATABASE_ID, SAVED_TABLE_ID, ID.unique(), {
            movie_id: movie.movie_id,
            title: movie.title,
            poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            vote_average: movie.vote_average,
            release_date: movie.release_date,
        });
    } catch (error) {
        console.error("Error saving movie:", error);
        throw error;
    }
};

export const unsaveMovie = async (movieId: string): Promise<void> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, SAVED_TABLE_ID, [
            Query.equal("movie_id", movieId),
        ]);
        if (result.documents.length > 0) {
            await database.deleteDocument(
                DATABASE_ID,
                SAVED_TABLE_ID,
                result.documents[0].$id
            );
        }
    } catch (error) {
        console.error("Error removing saved movie:", error);
        throw error;
    }
};

export const isMovieSaved = async (movieId: string): Promise<boolean> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, SAVED_TABLE_ID, [
            Query.equal("movie_id", movieId),
        ]);
        return result.documents.length > 0;
    } catch (error) {
        console.error("Error checking saved movie:", error);
        return false;
    }
};

export const getSavedMovies = async (): Promise<Movie[]> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, SAVED_TABLE_ID, [
            Query.limit(100),
        ]);
        return result.documents.map((doc) => ({
            id: Number(doc.movie_id),
            title: doc.title,
            poster_path: doc.poster_path.replace('https://image.tmdb.org/t/p/w500', ''),
            vote_average: doc.vote_average,
            release_date: doc.release_date,
        })) as Movie[];
    } catch (error) {
        console.error("Error fetching saved movies:", error);
        return [];
    }
};