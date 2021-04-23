export default function tawkTo(propertyId, key){

    if (!window) {
        throw new Error('DOM is unavailable')
    }

    window.Tawk_API       = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const tawk = document.getElementById('tawkId');
    if (tawk) {
        // Prevent TawkTo to create root script if it already exists
        return window.Tawk_API;
    }

    if(!key) {
        throw new Error("Key not provided. Get key from tawk dashboard - Direct Chat Link");
    }

    const script = document.createElement("script");
    script.id    = 'tawkId';
    script.async = true;
    script.src   = ""
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    const first_script_tag = document.getElementsByTagName("script")[0];
    if (!first_script_tag || !first_script_tag.parentNode) {
        throw new Error('DOM is unavailable')
    }

    first_script_tag.parentNode.insertBefore(script, first_script_tag)
}