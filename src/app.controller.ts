import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return `<!DOCTYPE html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      <title>Welcome</title>
                      <link rel="icon" type="image/x-icon" href="/favicon.ico">
                    </head>
                    <body
                      style="
                        display: flex;
                        flex-direction: column;
                        font-family: san-serif;
                      "
                    >
                      <div style="margin: 20rem; text-align: center; display: flex; flex-direction: column;">
                        <h1 style="color: #050a22; font-size:42px;">Welcome to our Appointment Backend Server📡</h1>
                        <p style="color: #3366ff; font-size:24px;">Server is currently active...........</p>
                      </div>
                    </body>
                  </html>`;
  }
}
