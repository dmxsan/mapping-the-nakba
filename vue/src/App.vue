<script setup lang="ts">
import { inject } from '@vercel/analytics'
import WebGISViewer from '@/components/WebGISViewer.vue'

inject()
</script>

<template>
  <WebGISViewer />
</template>
