const demoSteps = [
    {
        title: "Start session",
        method: "POST",
        endpoint: "/session",
        url: "about:blank",
        status: "Chrome session created: 7f3b-arken-demo",
        email: "",
        buttonState: "idle",
        rust: `let mut driver = Driver::new("http://localhost:9515");
driver.start().await?;`,
        request: `{
  "capabilities": {
    "alwaysMatch": {
      "browserName": "chrome"
    }
  }
}`
    },
    {
        title: "Navigate",
        method: "POST",
        endpoint: "/session/7f3b-arken-demo/url",
        url: "https://example.test/login",
        status: "Navigation complete.",
        email: "",
        buttonState: "idle",
        rust: `driver.navigate("https://example.test/login").await?;`,
        request: `{
  "url": "https://example.test/login"
}`
    },
    {
        title: "Find element",
        method: "POST",
        endpoint: "/session/7f3b-arken-demo/element",
        url: "https://example.test/login",
        status: "Found element: email-input",
        email: "",
        buttonState: "found",
        rust: `let email = driver
    .find_element(By::id("email"))
    .await?;`,
        request: `{
  "using": "css selector",
  "value": "#email"
}`
    },
    {
        title: "Send keys",
        method: "POST",
        endpoint: "/session/7f3b-arken-demo/element/email-input/value",
        url: "https://example.test/login",
        status: "Typed email into the located field.",
        email: "cayden@example.test",
        buttonState: "filled",
        rust: `email.send_keys("cayden@example.test").await?;`,
        request: `{
  "text": "cayden@example.test"
}`
    },
    {
        title: "Click",
        method: "POST",
        endpoint: "/session/7f3b-arken-demo/element/submit-button/click",
        url: "https://example.test/login",
        status: "Submit clicked. The automated action completed.",
        email: "cayden@example.test",
        buttonState: "clicked",
        rust: `let submit = driver
    .find_element(By::css("button[type='submit']"))
    .await?;

submit.click().await?;`,
        request: `{}`
    },
    {
        title: "Quit",
        method: "DELETE",
        endpoint: "/session/7f3b-arken-demo",
        url: "about:blank",
        status: "Session closed and browser process cleaned up.",
        email: "",
        buttonState: "idle",
        rust: `driver.quit().await?;`,
        request: `{}`
    }
];

const stepTitle = document.querySelector("[data-demo-step-title]");
const methodNode = document.querySelector("[data-demo-method]");
const endpointNode = document.querySelector("[data-demo-endpoint]");
const rustNode = document.querySelector("[data-demo-rust]");
const requestNode = document.querySelector("[data-demo-request]");
const urlNode = document.querySelector("[data-demo-url]");
const emailNode = document.querySelector("[data-demo-email]");
const statusNode = document.querySelector("[data-demo-status]");
const pageNode = document.querySelector("[data-demo-page]");
const buttonNode = document.querySelector("[data-demo-button]");
const timelineNodes = Array.from(document.querySelectorAll("[data-demo-timeline]"));
const runButton = document.querySelector("[data-demo-run]");
const nextButton = document.querySelector("[data-demo-next]");
const resetButton = document.querySelector("[data-demo-reset]");

let currentStep = 0;
let runTimer = null;

const setStep = (stepIndex) => {
    currentStep = stepIndex;
    const step = demoSteps[currentStep];

    stepTitle.textContent = step.title;
    methodNode.textContent = step.method;
    endpointNode.textContent = step.endpoint;
    rustNode.textContent = step.rust;
    requestNode.textContent = step.request;
    urlNode.textContent = step.url;
    emailNode.value = step.email;
    statusNode.textContent = step.status;
    pageNode.dataset.demoState = step.buttonState;
    buttonNode.textContent = step.buttonState === "clicked" ? "Submitted" : "Submit";

    timelineNodes.forEach((node, index) => {
        node.classList.toggle("is-active", index === currentStep);
        node.classList.toggle("is-complete", index < currentStep);
    });
};

const stopRun = () => {
    if (runTimer) {
        window.clearInterval(runTimer);
        runTimer = null;
    }

    runButton.textContent = "Run flow";
};

runButton?.addEventListener("click", () => {
    if (runTimer) {
        stopRun();
        return;
    }

    setStep(0);
    runButton.textContent = "Pause";

    runTimer = window.setInterval(() => {
        if (currentStep >= demoSteps.length - 1) {
            stopRun();
            return;
        }

        setStep(currentStep + 1);
    }, 1200);
});

nextButton?.addEventListener("click", () => {
    stopRun();
    setStep((currentStep + 1) % demoSteps.length);
});

resetButton?.addEventListener("click", () => {
    stopRun();
    setStep(0);
});

timelineNodes.forEach((node, index) => {
    node.addEventListener("click", () => {
        stopRun();
        setStep(index);
    });
});

setStep(0);
