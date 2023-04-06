import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import cards from "../tarotcard/tarot-images";

function TarotCard() {
  const { id } = useParams();
  const tarot = cards.cards[id];

  return (
    <>
      <h1>{tarot.name}</h1>
      <img src={tarot.img} alt={tarot.name}></img>
      {tarot.Questions_to_Ask.map((q, i) => (
        <h5 key={i}>{q}</h5>
      ))}
      <p>{tarot.Mythical_Spiritual}</p>
    </>
  );
}
export default TarotCard;
