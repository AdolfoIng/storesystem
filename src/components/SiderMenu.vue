<!-- src/components/SidebarMenu.vue -->
<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Mi App</h2>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link :to="{ name: 'DashboardHome' }" active-class="active-link"
            exact-active-class="exact-active-link">
            <!-- Icono (ejemplo con texto, podrías usar SVG o FontAwesome) -->
            <span>🏠</span> Inicio
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Inventory' }" active-class="active-link" exact-active-class="exact-active-link">
            <span>🚚</span> Inventory Product
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Register' }" active-class="active-link" exact-active-class="exact-active-link">
            <span>📑</span> Register Product
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="sidebar-footer">
      <button @click="requestLogout" class="logout-button">
        <span>🚪</span> Cerrar Sesión
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
// Define el evento 'logout' que el componente padre escuchará
// Usando la sintaxis de objeto para mejor claridad y potencial validación futura
const emit = defineEmits<{
  (e: 'logout'): void // Define el evento y su payload (ninguno en este caso)
}>();

// Función que emite el evento
const requestLogout = (): void => {
  // Podrías añadir una confirmación aquí si quisieras
  // if (confirm('¿Seguro que quieres cerrar sesión?')) {
  emit('logout');
  // }
};
</script>

<style scoped>
.sidebar {
  width: 240px;
  background-color: #2c3e50;
  /* Un azul oscuro */
  color: #ecf0f1;
  /* Un gris claro */
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* Ocupa toda la altura */
  position: sticky;
  /* Para que se quede fijo si el contenido principal hace scroll */
  top: 0;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #34495e;
  /* Separador sutil */
}

.sidebar-header h2 {
  margin: 0;
  color: #ffffff;
}

.sidebar-nav {
  flex-grow: 1;
  /* Ocupa el espacio disponible */
  padding-top: 15px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin: 0 10px 5px 10px;
  /* Espacio horizontal y vertical */
}

.sidebar-nav a {
  color: #bdc3c7;
  /* Un gris más apagado para los enlaces */
  text-decoration: none;
  display: flex;
  /* Para alinear icono y texto */
  align-items: center;
  padding: 12px 15px;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-weight: 500;
}

.sidebar-nav a span {
  margin-right: 12px;
  /* Espacio entre icono y texto */
  font-size: 1.1em;
  /* Icono un poco más grande */
}

.sidebar-nav a:hover {
  background-color: #34495e;
  /* Un azul/gris ligeramente más claro */
  color: #ffffff;
}

/* Estilos específicos para el enlace activo */
.sidebar-nav a.exact-active-link {
  background-color: #1abc9c;
  /* Un color turquesa para el activo */
  color: #ffffff;
  font-weight: bold;
}

/* Si quieres diferenciar active de exact-active (para rutas anidadas) */
/* .sidebar-nav a.active-link { ... } */


.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #34495e;
}

.logout-button {
  background-color: transparent;
  color: #e74c3c;
  /* Rojo para logout */
  border: 1px solid #e74c3c;
  padding: 10px;
  width: 100%;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.logout-button span {
  margin-right: 8px;
}

.logout-button:hover {
  background-color: #e74c3c;
  color: white;
}
</style>
