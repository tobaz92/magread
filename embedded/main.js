class Magread {
  constructor(target, options) {
    this.target = document.querySelector(target);
    this.token = options.token;
    this.fileId = options.fileId;
    this.init();
  }
  catch(error) {
    console.error("Error:", error);
  }
  async init() {
    await this.getConnection();
    if (window.MagreadConfig.error || window.MagreadConfig.message) {
      this.target.innerHTML =
        window.MagreadConfig.error || window.MagreadConfig.message;
      return;
    }

    this.addStyle();
    this.addScript();
  }
  async getConnection() {
    try {
      const result = await fetch("http://localhost:3000/settings/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: this.token,
          domain: this.getUserDomain(),
          fileId: this.fileId,
          fingerPrint: this.getUserFingerprint(),
        }),
      });
      const data = await result.json();
      window.MagreadConfig = data;
    } catch (error) {
      // console.error("Error:", error);
      window.MagreadConfig = {
        error: "You don't have access to this document",
      };
    }
  }
  getUserFingerprint() {
    return {
      user_agent: window.navigator.userAgent,
      platform: window.navigator.platform,
      ip: window.location.hostname,
    };
  }
  getUserDomain() {
    return {
      domain: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      href: window.location.href,
    };
  }

  addScript() {
    const script = document.createElement("script");
    script.src = window.MagreadConfig.assets.script;
    document.body.appendChild(script);
  }
  addStyle() {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = window.MagreadConfig.assets.style;
    document.head.appendChild(style);
  }
}

window.Magread = Magread;
