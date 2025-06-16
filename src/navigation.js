searchFormBtn.addEventListener('click', (e) => {
  e.preventDefault(); // previene recarga del form
  const query = searchFormInput.value.trim();
  if (query) {
    location.hash = '#search=' + encodeURIComponent(query);
  }
});

  
trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
  });

arrowBtn.addEventListener('click', () => {
    location.hash = '#home';
  });


window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
  console.log({ location });
  
  if (location.hash.startsWith('#trends')) {
    trendsPage();
  } else if (location.hash.startsWith('#search=')) {
    searchPage();
  } else if (location.hash.startsWith('#movie=')) {
    movieDetailsPage();
  } else if (location.hash.startsWith('#category=')) {
    categoriesPage();
  } else {
    homePage();
  }
}


function homePage() {
    console.log('Home!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
  
    trendingPreviewSection.classList.remove('inactive');
    likedmoviesection.classList.remove('inactive');

    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

  getTrendingpreview();
  getlistadegeneros();
  getLikedMovies();
}

function categoriesPage() {
    console.log('categories!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
  
    trendingPreviewSection.classList.add('inactive');
    likedmoviesection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_,catgorydata] = location.hash.split("="); // [category,id-name]
    const [categoryid,categoryname] = catgorydata.split("-");
    window.scroll(0,0);


    headerCategoryTitle.innerHTML = categoryname;

    getpeliculascategorias(categoryid);
}

function movieDetailsPage() {
    console.log('Movie!!');

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
   

    searchForm.classList.add('inactive');
  
    trendingPreviewSection.classList.add('inactive');
    likedmoviesection.classList.add('inactive'); 
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    const [_, movieid] = location.hash.split("="); // #search=nombre
    peliculaById(movieid);
}

function searchPage() {
    console.log('Search!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
  
    trendingPreviewSection.classList.add('inactive');
    likedmoviesection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    
    const [_, searchValue] = location.hash.split("="); // #search=nombre
    const decodedSearch = decodeURIComponent(searchValue);
    headerCategoryTitle.innerText = decodedSearch;
  
    getpeliculaspornoombre(decodedSearch);

}

function trendsPage() {
    console.log('TRENDS!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    headerCategoryTitle.innerText = "tendencias ";
  
    searchForm.classList.add('inactive');
  
    trendingPreviewSection.classList.add('inactive');
    likedmoviesection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    tendenciasgeneral();
}