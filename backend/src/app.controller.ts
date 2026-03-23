import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getData() {
    return [
      { id: 1, name: "BMW E60 Far", price: 120 },
      { id: 2, name: "Prado Disk", price: 250 },
    ];
  }
}