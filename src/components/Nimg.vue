<template>
    <img :src="newSrc" :style="'width:'+width+'; height:'+height+'; display:block;'" :mode="mode" />
</template>
<script>
import $ from '@/common'
export default {
    props: {
        src: String,
        mode: {
            type: String,
            default: 'aspectFit'
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '100%'
        }
    },
    computed: {
        newSrc() {
            let src = this.src
            if (src && (src.startsWith('http:') || src.startsWith('https:') || src.startsWith('//'))) {
                return src
            }
            return $.$img(src)
        }
    }
}
</script>




