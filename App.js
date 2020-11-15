/** @format */

import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef } from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	Dimensions,
	Image,
	Animated,
} from 'react-native';
import { getMovies } from './api';
import Loading from './components/Loading';
import Rating from './Rating';
import Genres from './Genres';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SPACING = 10;
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;

const Backdrop = ({ movies, scrollX }) => {
	return (
		<View
			style={{
				position: 'absolute',
				width,
				height: BACKDROP_HEIGHT,
			}}
		>
			<FlatList
				data={movies}
				keyExtractor={(item) => item.key + '-backdrop'}
				removeClippedSubviews={false}
				contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
				renderItem={({ item, index }) => {
					if (!item.backdrop) {
						return null;
					}

					const translateX = scrollX.interpolate({
						inputRange: [
							(index - 2) * ITEM_SIZE,
							(index - 1) * ITEM_SIZE,
						],
						outputRange: [0, width],
					});

					return (
						<Animated.View
							style={{
								width,
								height: BACKDROP_HEIGHT,
                overflow: 'hidden',
							}}
						>
							<Image
								source={{ uri: item.backdrop }}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  position: 'absolute',
                }}

							></Image>
						</Animated.View>
					);
				}}
			></FlatList>
			<LinearGradient
				colors={['transparent', '#fff']}
				style={{
					width,
					height: BACKDROP_HEIGHT / 2,
					position: 'absolute',
					bottom: 0,
				}}
			></LinearGradient>
		</View>
	);
};

export default function App() {
	const [movies, setMovies] = useState([]);
	const scrollX = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const fetchData = async () => {
			const movies = await getMovies();
			setMovies([
				{ key: 'spacer-left' },
				...movies,
				{ key: 'spacer-right' },
			]);
		};

		if (movies.length === 0) {
			setTimeout(() => {
				fetchData();
			}, 500);
		}
	}, [movies]);

	if (movies.length === 0) {
		return <Loading></Loading>;
	}

	return (
		<View style={styles.container}>
			<StatusBar hidden />
			{movies.length !== 0 && (
				<Backdrop movies={movies} scrollX={scrollX}></Backdrop>
			)}
			<Animated.FlatList
				data={movies}
				keyExtractor={(item) => item.key}
				horizontal
				contentContainerStyle={{
					alignItems: 'center',
				}}
				onScroll={Animated.event(
					[
						{
							nativeEvent: {
								contentOffset: {
									x: scrollX,
								},
							},
						},
					],
					{
						useNativeDriver: true,
					}
				)}
				scrollEventThrottle={16}
				bounces={false}
				renderToHardwareTextureAndroid
				snapToInterval={ITEM_SIZE}
				decelerationRate='fast'
				snapToAlignment='start'
				renderItem={({ item, index }) => {
					if (!item.poster) {
						return <View style={{ width: EMPTY_ITEM_SIZE }}></View>;
					}

					const inputRange = [
						(index - 2) * ITEM_SIZE,
						(index - 1) * ITEM_SIZE,
						index * ITEM_SIZE,
					];
					const translateY = scrollX.interpolate({
						inputRange,
						outputRange: [100, 70, 100],
					});

					return (
						<View style={{ width: ITEM_SIZE }}>
							<Animated.View
								style={{
									marginHorizontal: SPACING,
									padding: SPACING * 2,
									alignItems: 'center',
									backgroundColor: 'white',
									borderRadius: 34,
									transform: [{ translateY }],
								}}
							>
								<Image
									source={{ uri: item.poster }}
									style={styles.posterImage}
								></Image>

								<Text
									style={{ fontSize: 24 }}
									numberOfLines={1}
								>
									{item.title}
								</Text>
								<Rating rating={item.rating} />
								<Genres genres={item.genres} />
								<Text
									style={{ fontSize: 12 }}
									numberOfLines={3}
								>
									{item.description}
								</Text>
							</Animated.View>
						</View>
					);
				}}
			></Animated.FlatList>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	posterImage: {
		width: '100%',
		height: ITEM_SIZE * 1.2,
		resizeMode: 'cover',
		borderRadius: 24,
		margin: 0,
		marginBottom: 10,
	},
});
