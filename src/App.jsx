import { useState, useEffect } from "react";
import client from "../client/axiosConfig";
import "./App.css";

function App() {
  const [songs, setSongs] = useState([]);
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [audio, setAudio] = useState(null);
  // const [isPlaying, setIsPlaying] = useState(false);

  const colors = ["#48E5C2", "#FFD23F", "#3ABEFF"];

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    if (audio) {
      audio.addEventListener("ended", handleAudioEnded);
      return () => {
        audio.removeEventListener("ended", handleAudioEnded);
      };
    }
  }, [audio]);

  const handleAudioEnded = () => {
    setAudio(null);
  };

  const fetchSongs = async () => {
    try {
      const response = await client.get("http://localhost:8000/song");
      setSongs(response.data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const addSong = async () => {
    try {
      console.log("Adding song:", song, artist, isFavorite);
      const response = await client.post("http://localhost:8000/song", {
        name: song,
        artist: artist,
        isFav: isFavorite,
      });
      console.log("Song added:", response.data);
      fetchSongs();
      setArtist("");
      setSong("");
      setIsFavorite(false);
    } catch (error) {
      console.error("Error adding song:", error);
    }
  };

  const playPreview = (preview_url) => {
    // Implement logic to play preview
    console.log("Playing preview:", preview_url);

    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
    const newAudio = new Audio(preview_url);
    setAudio(newAudio);
    newAudio.play();
  };

  const deleteSong = async (id) => {
    try {
      await client.delete(`http://localhost:8000/song/${id}`);
      fetchSongs();
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  const toggleFavorite = async (id, isFavorite) => {
    try {
      await client.patch(`http://localhost:8000/song/${id}?isFav=${!isFavorite}`);
      fetchSongs();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        minWidth: "100%",
        overflow: "hidden",
        minHeight: "100vh",
        maxHeight: "fit-content",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />
      <div
        style={{
          display: "flex",
          position: "relative",
          flexDirection: "column",
          gap: 20,
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
          padding: 10,
          borderRight: "2px solid #ccc",
          backgroundColor: "#003844",
        }}
      >
        <input
          style={{
            marginBottom: 10,
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ccc",
            width: 200,
            fontSize: 16,
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "black",
          }}
          type="text"
          placeholder="Artista"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <input
          style={{
            marginBottom: 10,
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ccc",
            width: 200,
            fontSize: 16,
            fontWeight: "bold",
            color: "white",
            backgroundColor: "black",
          }}
          type="text"
          placeholder="Canción"
          value={song}
          onChange={(e) => setSong(e.target.value)}
        />
        <label
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            fontSize: 16,
            fontWeight: "bold",
            color: "white",
          }}
        >
          Favorito:
          <input
            type="checkbox"
            checked={isFavorite}
            onChange={() => setIsFavorite(!isFavorite)}
          />
        </label>
        <button
          style={{
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ccc",
            width: 200,
            fontSize: 16,
            fontWeight: "bold",
            color: "black",
            // backgroundColor: "#DBCBC1",
            backgroundColor: "#F3D3BD",
          }}
          onClick={addSong}
        >
          Agregar Canción
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: "center",
          flex: 3,
          padding: 20,
          backgroundColor: "#FCFAF9",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <h2>Canciones</h2>
        <div
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            gap: 20,
            justifyContent: "center"
            // display: "grid",
            // gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            // gap: 10,
            // justifyContent: "center",
          }}
        >
          {songs.map((song, index) => (
            <div
              style={{
                display: "inline",
                border: "2px solid #ccc",
                padding: 20,
                borderRadius: 10,
                backgroundColor: colors[index % colors.length],
                flexBasis: "calc(20% - 40px)",
              }}
              key={song.id}
            >
              <img src={song.img_url} alt="Album" width={200} />
              <h4 style={{ color: "gray" }}>{song.artist}</h4>
              <p style={{ fontSize: 18, fontWeight: "bold" }}>{song.name}</p>
              <div
                style={{ display: "flex", gap: 10, justifyContent: "center" }}
              >
                <button
                  onClick={
                    audio
                      ? () => {
                          audio.pause();
                          setAudio(null);
                        }
                      : () => playPreview(song.preview_url)
                  }
                  disabled={!song.preview_url}
                >
                  {audio && audio.src === song.preview_url ? (
                    <span
                      style={{
                        fontSize: 24,
                        color: song.preview_url ? "green" : "gray",
                      }}
                      className="material-symbols-outlined"
                    >
                      stop_circle
                    </span>
                  ) : (
                    <span
                      style={{ fontSize: 24, color: "gray" }}
                      className="material-symbols-outlined"
                    >
                      play_circle
                    </span>
                  )}
                </button>
                <button onClick={() => deleteSong(song.id)}>
                  <span
                    style={{ fontSize: 24, color: "red" }}
                    className="material-symbols-outlined"
                  >
                    cancel
                  </span>
                </button>
                <button
                  onClick={() => toggleFavorite(song.id, song.isFav)}
                >
                  {song.isFav ? (
                    <span
                      style={{ fontSize: 24, color: "gold" }}
                      className="material-symbols-outlined"
                    >
                      star
                    </span>
                  ) : (
                    <span
                      style={{ fontSize: 24, color: "gray" }}
                      className="material-symbols-outlined"
                    >
                      star_border
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
