const googleBtn = document.getElementById("ggl")
googleBtn?.addEventListener("click", e => {
    window.location.href = "/auth/google"
})

const keyDiv = document.getElementById("keyDiv")
const codeElem = document?.querySelector("code")
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
    const {key, ...others} = data
    codeElem.innerText = key.slice(0,6) + "".padStart(data.key.length - 6, "*")
    const copyBtn = document.createElement("button")
    keyDiv.appendChild(copyBtn)
    copyBtn.innerText = "Copy to clipboard"
    copyBtn.onclick = () => {
        window.navigator.clipboard.writeText(data.key)
    }
    const pre = document.querySelector("pre")
    pre.innerText = JSON.stringify(others, null, 4)
})

const adminBtn = document.getElementById("adminBtn")

adminBtn?.addEventListener("click", async () => {
    const res = await fetch("/api/keys/admin", {
        method: "post"
    })
    if (!res.ok) {

        return;
    }
    const data = await res.json()
    alert(data.key)
})