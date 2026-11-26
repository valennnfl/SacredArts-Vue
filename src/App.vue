<script setup></script>

<template>

  <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
                <h1>Sacred Arts</h1>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <RouterLink class="nav-link active" aria-current="page" to="/">Inicio</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/guardados">Guardados</RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

  <RouterView></RouterView>

  <footer>
        <div id="footer-content" class="container-sm">
            <div>
                <h3 class="all-caps">Sacred Arts</h3>
                <p>© 1994-2026 FromSoftware, Inc. <br>Todos los derechos reservados.</p>
            </div>
            <div class="footer-nav">
                <h3>Navegación</h3>
                <a href="#">Inicio</a>
                <a href="guardados.html">Guardados</a>
            </div>
        </div>
    </footer>

</template>