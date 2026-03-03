const googleBtn = document.getElementById("ggl")
googleBtn?.addEventListener("click", e => {
    window.location.href = "/auth/google"
})

const keyDiv = document.getElementById("keyDiv")
const codeElem = keyDiv?.querySelector("code")
/**@type HTMLButtonElement */
const genBtn = document.getElementById("genBtn")

genBtn?.addEventListener("click", async () => {
    genBtn.disabled = true;
    const res = await fetch("/api/keys", {
        method: "post"
    })
    if (!res.ok) {
        // TODO handle error
        return;
    }
    const data = await res.json()
    codeElem.innerText = data.key.slice(0,6) + "".padStart(data.key.length - 6, "*")
    const copyBtn = document.createElement("button")
    keyDiv.appendChild(copyBtn)
    copyBtn.innerText = "Copy to clipboard"
    copyBtn.onclick = () => {
        window.navigator.clipboard.writeText(data.key)
    }
})

