// Variable global para el manejo de la paginación y el botón de "Ver más"
let page = 1;
let btnload; // Variable global para el botón

const API_KEY = "dab460dbaf9fa1a0397027a771311cdb"
const api = axios.create({
  baseURL:"https://api.themoviedb.org/3/",
  headers:{

  },
  params:{
    api_key: API_KEY,
    language: "es-MX"
  }

}); 


function likedMoviesList() {
  const item = JSON.parse(localStorage.getItem('liked-movie'));
  let movies;

  if (item) {
    movies = item;
  } else {
    movies = {};
  }
  
  return movies;
}

function likemovie(movie) {
  // movie.id
  const likedMovies = likedMoviesList();

  if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined;
  } else {
    likedMovies[movie.id] = movie;
  }

  localStorage.setItem('liked-movie', JSON.stringify(likedMovies));
}


// Lazyloader con IntersectionObserver para carga diferida de imágenes


const lazyloader = new  IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting){
    const url = entry.target.getAttribute("data-img")
    entry.target.setAttribute  ("src",url);
    
    
  }

  })
  });

// ==============================
// ========== UTILS ============
// ==============================


// Crea tarjetas de películas y las inyecta en un contenedor
function createmovies(
  movies,
  container,
  {
    lazyload = false,
    clean = true,
  } = {},
){

  if (clean) {
    container.innerHTML = "";
  }

  movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);


 

    movieImg.setAttribute(
      lazyload ? 'data-img' : 'src',
      'https://image.tmdb.org/t/p/w300' + movie.poster_path,
    );

    movieContainer.addEventListener('click', () => {
      location.hash = '#movie=' + movie.id;
    });

    //esto es apra el boton de favoritos
    const moviebtn  = document.createElement('button');
    moviebtn.classList.add("movie-button");
    likedMoviesList()[movie.id] && moviebtn.classList.add("movie-btn--liked");  
    moviebtn.addEventListener('click' , (e) =>{
      e.stopPropagation(); // 👈 Esto evita que el clic al botón también active el evento del contenedor
      moviebtn.classList.toggle('movie-btn--liked');
      // Agregar a localStorage si quieres
      likemovie(movie);
    });

    if (lazyload) {
      lazyloader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg);   
    movieContainer.appendChild(moviebtn);   
    container.appendChild(movieContainer);

  });
}
// Crea lista de categorías (géneros)
function createcategories(generos,container) {
  container.innerHTML  = "";

  generos.forEach(genero => {
 
    const generocontenedor = document.createElement('div');  // Creamos un nuevo contenedor para cada película
    generocontenedor.classList.add('category-container');  // Agregamos una clase CSS llamada 'movie-container' al nuevo div, para poder darle estilo con CSS

    const generotitle = document.createElement('h3'); // Creamos una nueva etiqueta <img> para mostrar la imagen de la película
    generotitle.classList.add('category-title'); // Asignamos una clase CSS llamada 'movie-img' a la etiqueta <img> para poder darle estilo con CSS
    generotitle.setAttribute('id',"id" +  genero.id);// Asignamos el atributo 'alt' con el título de la película
    
    generotitle.addEventListener("click",() => {
      location.hash = "#category=" + genero.id +"-"+ encodeURIComponent(genero.name);

    });
    const generotitletex =  document.createTextNode(genero.name);


    generotitle.appendChild(generotitletex);
    generocontenedor.appendChild(generotitle);
    container.appendChild(generocontenedor);
    

    
  });
  
}

// ==============================
// === Llamadas a la API ========
// ==============================

// Películas en tendencia para preview en home
async function getTrendingpreview() {
    const {data} = await api('trending/movie/day');
    const movies = data.results;
   createmovies(movies,trendingMoviesPreviewList,{ lazyload: true })
};
// Lista de géneros para preview en home

async function getlistadegeneros() {
  const {data} = await api('genre/movie/list');

  const generos = data.genres;

  createcategories(generos,categoriesPreviewList)

};


// Películas por categoría (primera página)
async function getpeliculascategorias(id) {
  const {data} = await api('discover/movie' , {
    params:{
      with_genres:id

  },});
  console.log(data);

  const movies = data.results;
  createmovies(movies,genericSection,{ lazyload: true })
  // Botón para cargar más películas

  const btnload = document.createElement('button');
  btnload.innerText = "ver mas peliculas";
  btnload.addEventListener('click',() =>{
    btnload.remove();// 👈 eliminamos el botón original al hacer clic
    getcategoriasgeneral(id);// luego llamamos a la siguiente página
  });
  genericSection.appendChild(btnload);

};
// Cargar siguientes páginas de una categoría
async function getcategoriasgeneral(id) {
  page++;
  const {data} = await api('discover/movie',{
    params: {
      page,
      with_genres: id
    }
  });

  const movies = data.results;

  createmovies(movies,genericSection,{lazyload:true,clean:false});
 // Si el botón existe, lo quitamos para evitar duplicados
 if (btnload && btnload.parentElement) {
  btnload.remove();
}


  // Volvemos a agregar el botón para permitir más páginas (si es necesario)
  btnload = document.createElement('button');
  btnload.innerText = "Ver más películas";
  btnload.addEventListener('click', () => {
    getcategoriasgeneral(id); // ✅ Se sigue llamando correctamente
  });
  genericSection.appendChild(btnload);

  
}



// Películas buscadas por nombre
async function getpeliculaspornoombre(nombre) {
  const {data} = await api('search/movie',{
    params : {

      query: nombre

    }
  } );
  console.log(data);



  const movies = data.results;
  genericSection.innerHTML = "";



  movies.forEach(movie => {


    const movieContainer = document.createElement('div');  // Creamos un nuevo contenedor para cada película
    movieContainer.classList.add('movie-container');  // Agregamos una clase CSS llamada 'movie-container' al nuevo div, para poder darle estilo con CSS

    const movieImg = document.createElement('img'); // Creamos una nueva etiqueta <img> para mostrar la imagen de la película
    movieImg.classList.add('movie-img'); // Asignamos una clase CSS llamada 'movie-img' a la etiqueta <img> para poder darle estilo con CSS
    movieImg.setAttribute('alt', movie.title);// Asignamos el atributo 'alt' con el título de la película
    movieImg.setAttribute(
      'src',
      'https://image.tmdb.org/t/p/w300' + movie.poster_path,
    ); /// Asignamos la URL de la imagen (poster) de la película al atributo 'src' de la etiqueta <img>

    movieContainer.appendChild(movieImg); // Agrega la imagen (movieImg) al contenedor de la película (movieContainer).
    genericSection.appendChild(movieContainer);// Agrega el contenedor de la película (movieContainer) al contenedor principal de películas (trendingPreviewMoviesContainer).
  });
};


// Películas en tendencia general
async function tendenciasgeneral() {
  const {data} = await api('trending/movie/day');

  genericSection.innerHTML = "";
  const movies = data.results;

  createmovies(movies,genericSection,{lazyload:true,clean:true});


  const btnload = document.createElement('button');
  btnload.innerText = "ver mas peliculas";
  btnload.addEventListener('click',() =>{
    btnload.remove();// 👈 eliminamos el botón original al hacer clic
    getpaginasgeneralmovies();// luego llamamos a la siguiente página
  });
  genericSection.appendChild(btnload);

};

// Más películas de tendencia
async function getpaginasgeneralmovies() {
  page++;
  const {data} = await api('trending/movie/day',{
    params: {
      page,
    }
  });

  const movies = data.results;

  createmovies(movies,genericSection,{lazyload:true,clean:false});
 // Si el botón existe, lo quitamos para evitar duplicados
 if (btnload && btnload.parentElement) {
  btnload.remove();
}


  // Volvemos a agregar el botón para permitir más páginas (si es necesario)
  btnload = document.createElement('button');
  btnload.innerText = "Ver más películas";
  btnload.addEventListener('click', getpaginasgeneralmovies);
  genericSection.appendChild(btnload);

  
}

async function peliculaById(id){
  const {data:movie} = await api('movie/' + id);

  const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
  console.log(movieImgUrl)
  headerSection.style.background = `
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})
  `;
  movieDetailTitle.textContent = movie.title; 
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;


createcategories(movie.genres , movieDetailCategoriesList)
getRelatedMoviesId(id);
}

// Películas similares (relacionadas)
async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/similar`);
  const relatedMovies = data.results;

  createmovies(relatedMovies, relatedMoviesContainer);
}


  // ✅ Aquí quitamos la pantalla de carga una vez renderizado todo
document.getElementById('loading-screen').style.display = 'none';


//agregar local estorache a pelciulas favoritas

function getLikedMovies() {
  const likedMovies = likedMoviesList();
  const moviesArray = Object.values(likedMovies);

  createmovies(moviesArray, likedMoviesListArticle, { lazyload: true, clean: true });
  
  console.log(likedMovies)
}