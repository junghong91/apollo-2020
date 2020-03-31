import React from "react";
import { useParams } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import Movie from "../components/Movie";

const GET_MOVIE = gql`
  query getMovie($id: Int!) {
    movie(id: $id) {
      id
      title
      medium_cover_image
      language
      rating
      description_intro
      isLiked @client
    }
    suggestions(id: $id) {
      id
      medium_cover_image
    }
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 130vh;
  background-image: linear-gradient(#2c5570, #222324);
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
  margin-top: 70px;
`;

const Column = styled.div`
  margin-left: 10px;
  width: 50%;
`;

const Title = styled.h1`
  font-size: 65px;
  margin-bottom: 40px;
`;

const Subtitle = styled.h4`
  font-size: 35px;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 22px;
`;

const Poster = styled.div`
  width: 250px;
  height: 400px;
  background-color: transparent;
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 7px;
  margin-right: 150px;
`;

const SuggestedMovies = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 25px;
  width: 60%;
  height: 10vh;
  position: relative;
  top: 50px;
`;

const Suggested = styled.div`
  color: white;
  margin-top: 15px;
`;

export default () => {
  const { id } = useParams();
  const { loading, data } = useQuery(GET_MOVIE, {
    variables: { id: parseInt(id) }
  });
  return (
    <Box>
      <Container>
        <Column>
          <Title>
            {loading
              ? "Loading..."
              : `${data.movie.title} ${data.movie.isLiked ? "❤️" : "😭"}`}{" "}
          </Title>
          <Subtitle>
            {data?.movie?.language} {loading ? "" : "·"} {data?.movie?.rating}
            {loading ? "" : "/10"}
          </Subtitle>
          <Description>{data?.movie.description_intro}</Description>
        </Column>
        <Poster bg={data?.movie?.medium_cover_image}></Poster>
      </Container>
      <Suggested>{loading ? "" : "<추천 영화>"}</Suggested>
      <SuggestedMovies>
        {data &&
          data.suggestions &&
          data.suggestions.map(movie => (
            <Movie
              key={movie.id}
              id={movie.id}
              isLiked={movie.isLiked}
              bg={movie.medium_cover_image}
            />
          ))}
      </SuggestedMovies>
    </Box>
  );
};
