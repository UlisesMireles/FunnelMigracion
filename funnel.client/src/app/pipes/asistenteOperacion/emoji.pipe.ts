import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emoji'
})
export class EmojiPipe implements PipeTransform {
  lsEmoji: any[] = [
    { descripcion: "#Mundo#", emoji: '🌐' },
    { descripcion: "#Nota#", emoji: '📝' },
    { descripcion: "#Herramienta#", emoji: '🛠️' },
    { descripcion: "#Moneda#", emoji: '💰' },
    { descripcion: "#Llave#", emoji: '🗝️' },
  ]

  transform(value: string): string {
    this.lsEmoji.forEach(emoji => {
      if (value.includes(emoji.descripcion)) {
        value = value.replace(emoji.descripcion, emoji.emoji);
      }
    });
    return value;
  }

}
