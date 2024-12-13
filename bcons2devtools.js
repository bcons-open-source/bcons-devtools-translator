/*
  This class shows a bcons debug message on the devtools console.

  Only one method is exposed:

  - show(bconsMsg, preferences, decryptPass):
      if the provided preferences object permits, it displays the bcons debug
      message on the devtools console.

  The preferences object may contain the following members:

  - sendConsole: it must be true for the message to be shown on the console.
  - sendConsoleTabs: array of strings, where each string indicates that
                     messages of that type should be displayed on the console.
                     Possible values are "l" (log), "w" (warning), "e" (error),
                     "r" (request), "s" (session), "c" (cookies).
  - hideConsoleType: if true, the message type won't be shown.
  - hideConsoleUrl: if true, the URL of the request that generated the message
                    won't be shown.
  - hideConsoleFile: if true, the file name and line where the message was
                     created won't be shown.
  - hideConsoleDomain: if true, the domain of the request that generated the
                       message won't be shown.
  - hideConsoleMethod: if true, the method of the request that generated the
                       message won't be shown.
  - hideConsoleDate: if true, the date and time of the message won't be shown.
  - hiddenDomains: array of domains to hide from the console.
  - hiddenUrls: array of URLs to hide from the console.
  - hiddenFiles: array of files to hide from the console.
*/

class Bcons2devtools {
  static groupStack = [];
  static bconsIcon =
    "data:image/svg+xml;base64,PHN2ZyBpZD0iTG9nb190aXBvXzMiIGRhdGEtbmFtZT0iTG9nbyB0aXBvIDMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDE3MC43NCAxMTQuNjciPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDojMDBhZGI1MDA7fS5jbHMtMSwuY2xzLTJ7ZmlsbC1ydWxlOmV2ZW5vZGQ7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTExOC4zNiw1MS4wN0MxMzUuMTksNTQsMTQ3LjIsNjMuOTEsMTU1LjIyLDc4Ljc4bDEuNTEtLjE1YTQxLjY0LDQxLjY0LDAsMCwxLDE4LjczLDNDMTg3LDg2LjMxLDE5NCw5NS43MiwxOTcsMTA3LjUyYTUyLjY1LDUyLjY1LDAsMCwxLS4yNiwyNy43N2MtNC4xNiwxMy42Ny0xNCwyMC43OC0yNywyNS4yM2wtLjE0LDBhODMuNjUsODMuNjUsMCwwLDEtOC4xOSwyLjMxYy0xMy4xLDIuMzEtODMuMDYsMS4yNC05OC43Ny4xOWwtLjgtLjA5YTQ2LjkxLDQ2LjkxLDAsMCwxLTcuODUtMS43MmMtMTEuNzgtMy42Ny0yMC4xOC0xMS42OC0yNC0yMy41MWE0MC4yNyw0MC4yNywwLDAsMSwuMTItMjVjMi4yMy02LjgyLDUuNDQtMTEuNDUsOS44OC0xNSw1LjI2LTQuMTUsMTIuNTUtNi45LDE5LjA4LTguNzRDNjYuNTIsNjEuODQsOTAuNDgsNDYuMiwxMTguMzYsNTEuMDdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjcuOTQgLTUwLjE5KSIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE4NC4zLDk1LjY5Yy0yOS4xMi0uMy0zMC44MiwxLjctNDQsMTdxLTEuODcsMi4xOS00LjExLDQuNzZhMjIuMjgsMjIuMjgsMCwwLDAtMTUuMTQtNC42Yy0uMjktMi4yNS0uNTQtNC4zMy0uNzctNi4yNS0yLjM5LTIwLTIuNy0yMi42LTI3LTM4LjU3YTQuOTMsNC45MywwLDEsMC01LjQxLDguMjRjMjAuNDksMTMuNDUsMjAuNzQsMTUuNTMsMjIuNjUsMzEuNTEuMjcsMi4yMi41Niw0LjY4Ljk0LDcuNTItOC44OSwzLjk0LTE3LjQ3LDEyLjMtMjQsMjMuNTctMy0uOS01LjM1LTEuNjQtNS4zNS0xLjY0bC0xNS0xMC44Ni4wNi0yNGE3LjI1LDcuMjUsMCwwLDAtMTQuNS0uMDhzLS4wNiwyNy43LDAsMjcuN2E3LjIyLDcuMjIsMCwwLDAsMyw1Ljg5bDE4LjcxLDEzLjU4Yy0uNjcsMS45My0yLjgsOC45LTQuNTMsMTQuODJsNzkuNC41OS42OS0uMDYtLjItN2MuODUtMTMtMS42Mi0yNC43My02LjgyLTMzLDEuODktMi4xNCwzLjUxLTQsNS01LjcyLDEwLjQ5LTEyLjIxLDExLjg1LTEzLjgsMzYuMzctMTMuNTZhNC45Myw0LjkzLDAsMCwwLC4wOS05Ljg2Wm0tNzkuNzIsMzQuNjhhNi41OCw2LjU4LDAsMSwxLDQuMzgsOC4yMUE2LjU5LDYuNTksMCwwLDEsMTA0LjU4LDEzMC4zN1pNMTI5LjkzLDE1N2EyMi43MSwyMi43MSwwLDAsMS0yNS42MS03Ljc5LDMuNTksMy41OSwwLDEsMSw1LjU0LTQuNTdjNC45MSw1Ljk0LDEwLjYzLDcuNjgsMTgsNS40N2EzLjYsMy42LDAsMSwxLDIuMDYsNi44OVptMTAuNy0xNS42NWE2LjU4LDYuNTgsMCwxLDEtNC4zOS04LjIyQTYuNTksNi41OSwwLDAsMSwxNDAuNjMsMTQxLjMzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3Ljk0IC01MC4xOSkiLz48L3N2Zz4=";

  static async show(bconsMsg, preferences, decryptPass = null) {
    if (
      !preferences ||
      !preferences.sendConsole ||
      !preferences.sendConsoleTabs ||
      !Array.isArray(preferences.sendConsoleTabs) ||
      !preferences.sendConsoleTabs.includes(bconsMsg.mt)
    ) {
      return;
    }

    // Decrypt message
    if (bconsMsg.e == 1) {
      if (decryptPass) {
        const decrypted = await this.decryptMessage(bconsMsg, decryptPass);
        if (decrypted) bconsMsg = decrypted;
        else {
          console.warn(
            "Can't show message: invalid passphrase provided to Bcons2devtools::show",
          );
          return;
        }
      } else {
        console.warn(
          "Can't show message: no decrypt passphrase provided to Bcons2devtools::show",
        );
        return;
      }
    }

    // Filter out messages from ignored domains
    if (bconsMsg.h && preferences.hiddenDomains) {
      if (!Array.isArray(preferences.hiddenDomains))
        preferences.hiddenDomains = [preferences.hiddenDomains];
      if (preferences.hiddenDomains.includes(bconsMsg.h)) return null;
    }

    // Filter out messages from ignored URLs
    const endpoint = bconsMsg.url?.split("?")[0];
    if (endpoint && preferences.hiddenUrls) {
      if (!Array.isArray(preferences.hiddenUrls))
        preferences.hiddenUrls = [preferences.hiddenUrls];

      if (preferences.hiddenUrls.includes(endpoint)) return null;
    }

    // Filter out messages from ignored files
    const fn = bconsMsg.fn?.split("/").pop();
    if (fn && preferences.hiddenFiles) {
      if (!Array.isArray(preferences.hiddenFiles))
        preferences.hiddenFiles = [preferences.hiddenFiles];

      if (preferences.hiddenFiles.includes(fn)) return null;
    }

    // Console clear requested
    if (bconsMsg.x && bconsMsg.x.clearConsole)
      // eslint-disable-next-line no-console
      console.clear();

    // Check for group start / end
    if (bconsMsg.x && bconsMsg.x.groupEnd) {
      // eslint-disable-next-line no-console
      console.groupEnd();
      this.groupStack.pop();
      return;
    }

    if (bconsMsg.x && bconsMsg.x.groupData) {
      if (!this.groupStack.includes(bconsMsg.x.groupData.id)) {
        this.groupStack.push(bconsMsg.x.groupData.id);

        if (bconsMsg.x.groupData.collapsed)
          // eslint-disable-next-line no-console
          console.groupCollapsed(bconsMsg.x.groupData.label);
        else {
          // eslint-disable-next-line no-console
          console.group(
            `%c${bconsMsg.x.groupData.label}`,
            `background-image: url(${this.bconsIcon}); background-size: 16px 16px; background-position: 2px -3px; padding-left: 20px;background-repeat:no-repeat;`,
          );
        }
      }
    } else {
      if (this.groupStack.length) {
        // eslint-disable-next-line no-console
        console.groupEnd();
        this.groupStack.pop();
      }
    }

    // Ping messages
    if (typeof bconsMsg?.x?.ping == "string") {
      bconsMsg.m = bconsMsg.x.ping.trim() || "PING";
    }

    // Trace messages
    if (bconsMsg.x && bconsMsg.x.traceIsMsg && bconsMsg.x.phpBt) {
      bconsMsg.m = bconsMsg.x.phpBt
        .map((e) => `\n${e.file} (${e.line})\n${e.code.trim()}`)
        .join("\n");
      bconsMsg.mt = "t";
    }

    // Show message
    let content = bconsMsg.m;

    const tmp = document.createElement("div");
    tmp.innerHTML = content;
    const defaultContent = tmp.textContent;

    switch (bconsMsg.ct) {
      case "d":
      case "r":
        if (typeof content == "string") content = JSON.parse(content);
        break;

      default:
        content = defaultContent;
        break;
    }

    const params = [content];
    const url = endpoint;
    const file =
      bconsMsg.fn && bconsMsg.fl
        ? `${bconsMsg.fn.split("/").pop()} (${bconsMsg.fl})`
        : "";
    let values = "";

    const firstItem = !preferences.hideConsoleType
      ? "type"
      : !preferences.hideConsoleDate
        ? "date"
        : !preferences.hideConsoleDomain
          ? "domain"
          : !preferences.hideConsoleUrl
            ? "method"
            : !preferences.hideConsoleMethod
              ? "url"
              : !preferences.hideConsoleFile
                ? "file"
                : "";
    const lastItem = !preferences.hideConsoleFile
      ? "file"
      : !preferences.hideConsoleUrl
        ? "url"
        : !preferences.hideConsoleMethod
          ? "method"
          : !preferences.hideConsoleDomain
            ? "domain"
            : !preferences.hideConsoleDate
              ? "date"
              : !preferences.hideConsoleType
                ? "type"
                : "";

    if (bconsMsg.x.ping)
      params.unshift(this.dataItem("#373", !firstItem, !lastItem));

    if (!preferences.hideConsoleFile) {
      params.unshift(
        this.dataItem("#454", firstItem == "file", lastItem == "file"),
      );
    }

    if (!preferences.hideConsoleUrl) {
      params.unshift(
        this.dataItem("#006ca2", firstItem == "url", lastItem == "url"),
      );
    }

    if (!preferences.hideConsoleMethod)
    {
      params.unshift(
        this.dataItem("#482491", firstItem == "method", lastItem == "method"),
      );
    }

    if (!preferences.hideConsoleDomain) {
      params.unshift(
        this.dataItem("#a37500", firstItem == "domain", lastItem == "domain"),
      );
    }

    if (!preferences.hideConsoleDate) {
      params.unshift(
        this.dataItem("#525252", firstItem == "date", lastItem == "date"),
      );
    }

    if (!preferences.hideConsoleType) {
      const color = this.msgTypeColor(bconsMsg.mt);
      params.unshift(
        this.dataItem(color, firstItem == "type", lastItem == "type"),
      );
    }

    if (!preferences.hideConsoleType)
      values += "%c" + bconsMsg.mt.toUpperCase();

    if (!preferences.hideConsoleDate) {
      const date = new Date(this.tsToMilliseconds(bconsMsg.ts));
      values += "%c" + this.formatDate(date);
    }

    if (!preferences.hideConsoleDomain) values += "%c" + bconsMsg.h;

    if (!preferences.hideConsoleMethod) values += "%c" + bconsMsg.v;

    if (!preferences.hideConsoleUrl) values += "%c" + url;

    if (!preferences.hideConsoleFile) values += "%c" + file;

    if (bconsMsg.x.ping) values += "%cPING";

    params.unshift(values);

    if (bconsMsg.ct == "r")
      // eslint-disable-next-line no-console
      console.table(content, bconsMsg.x.columns);
    // eslint-disable-next-line no-console
    else console.log.apply(console, params);
  }

  static msgTypeColor(msgType) {
    switch (msgType) {
      case "w":
        return "#a09c1c";
      case "e":
        return "#a01c1c";
      case "r":
        return "#1ca03b";
      case "s":
        return "#881ca0";
      case "c":
        return "#211ca0";
      case "l":
      default:
        return "#1c86a0";
    }
  }

  static dataItem(color, roundStart = false, roundEnd = false) {
    let borders = "";

    if (roundStart)
      borders += "border-start-start-radius: 3px;border-end-start-radius: 3px;";

    if (roundEnd)
      borders += "border-end-end-radius: 3px;border-start-end-radius: 3px;";

    let str = `${borders} color: white; padding: 1px 5px; background:${color}; `;
    if (roundStart) {
      str += `background-image: url(${this.bconsIcon}); background-size: 16px 16px; background-position: 2px -2px; padding-left: 20px;background-repeat:no-repeat;`;
    }

    return str;
  }

  static async decryptMessage(data, decryptPass) {
    if (!data.e) return data;

    if (!decryptPass) return null;

    // Message content
    data.m = await this.decrypt(data.m, decryptPass);
    if (!data.m) return null;

    // Request domain
    data.h = await this.decrypt(data.h, decryptPass);
    if (!data.h) return null;

    // Request URL
    data.url = await this.decrypt(data.url, decryptPass);
    if (!data.url) return null;

    // Request method
    data.v = await this.decrypt(data.v, decryptPass);
    if (!data.v) return null;

    // File info
    data.fl = await this.decrypt(data.fl, decryptPass);
    if (!data.fl) return null;
    data.fn = await this.decrypt(data.fn, decryptPass);
    if (!data.fn) return null;

    // Extra data
    data.x = await this.decrypt(data.x, decryptPass);
    if (!data.x) return null;
    else data.x = JSON.parse(data.x);

    // Message has been decrypted, remove the encryption flag
    data.e = 0;
    return data;
  }

  // Based on code kindly provided by ChatGPT, we love you, please
  // don't kill us!
  static async decrypt(encryptedData, passphrase) {
    // Decode Base64 to ArrayBuffer
    const dataBuffer = this.base64ToArrayBuffer(encryptedData);

    // Extract the IV (first 16 bytes)
    const iv = dataBuffer.slice(0, 16);

    // The rest is the ciphertext
    const ciphertext = dataBuffer.slice(16);

    // Generate the cryptographic key from the passphrase
    const keyMaterial = await this.getKeyMaterial(passphrase);
    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      keyMaterial,
      { name: "AES-CBC" },
      false,
      ["decrypt"],
    );

    // Decrypt the data
    try {
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-CBC",
          iv,
        },
        cryptoKey,
        ciphertext,
      );

      // Convert decrypted ArrayBuffer back to a string
      return new TextDecoder().decode(decrypted);
    } catch (e) {
      return null;
    }
  }

  static base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

    return bytes.buffer;
  }

  static async getKeyMaterial(passphrase) {
    const encoder = new TextEncoder();
    return window.crypto.subtle.digest(
      { name: "SHA-256" },
      encoder.encode(passphrase),
    );
  }

  static tsToMilliseconds(ts) {
    return ts >= 1e12 ? ts : ts * 1000;
  }

  static formatDate(date) {
    if (typeof date === "string") date = new Date(date);

    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h24",
    };
    const dateFormatter = new Intl.DateTimeFormat(navigator.language, options);

    try {
      const formatted = dateFormatter.format(date);
      return formatted;
    } catch (err) {
      return date.toString();
    }
  }
}

export default Bcons2devtools;

