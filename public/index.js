async function run() {
    // A service worker must be registered in order to send notifications on iOS
    const reg = await navigator.serviceWorker.getRegistration()
    await reg.unregister();
    const registration = await navigator.serviceWorker.register(
        "serviceworker.js",
        {
            scope: "./",
        }
    );

    const button = document.getElementById("subscribe");

    const areNotificationsGranted = window.Notification.permission === "granted";
    if (areNotificationsGranted) {
        button.innerText = "Send Notification";

        await register(registration);
    
        button.addEventListener("click", async () => {
            await fetch("/send-notification");
        });
    } else {
        button.addEventListener("click", async () => {
            // Triggers popup to request access to send notifications
            const result = await window.Notification.requestPermission();

            // If the user rejects the permission result will be "denied"
            if (result === "granted") {
                await register(registration);
        
                window.location.reload();
            }
        });
    }
}

async function register(registration) {
    const data = await fetch('/pubkey');
    const text = await data.text();
    const subscription = await registration.pushManager.subscribe({
        applicationServerKey: text,
        userVisibleOnly: true,
    });

    await fetch("/save-subscription", {
        method: "post",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
    });
}

run();
