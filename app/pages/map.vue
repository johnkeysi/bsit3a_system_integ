<template>
  <v-container class="pa-4">
    <div class="d-flex align-center mb-4">
      <v-btn icon variant="text" to="/" class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="text-h6 font-weight-medium">Map</h1>
    </div>
    <ClientOnly>
      <LeafletMap />
      <template #fallback>
        <div style="height: 500px; display: flex; align-items: center; justify-content: center;">
          <v-progress-circular indeterminate color="grey"></v-progress-circular>
        </div>
      </template>
    </ClientOnly>
  </v-container>
</template>