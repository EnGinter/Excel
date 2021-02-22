import { $ } from '@core/dom';

export const tableResize = (event, $root) => {
  const $resizer = $(event.target)
  const $parent = $($resizer.getClosest('[data-type="resizer"]'))
  const cords = $resizer.getCords()
  const resizingType = $resizer.data.resize

  $resizer.setAttribute('data-resizing', 'true')

  if (resizingType === 'col') {
    let newWidth = ''

    const moveResizer = (e) => {
      const initialWidth = $parent.getCords().width
      const delta = e.clientX - cords.right
      $resizer.css({transform: -delta > initialWidth ? 0 : `translateX(${delta}px)`})
      newWidth = delta + initialWidth + 'px'
    }

    const mouseUpResizer = () => {
      const id = $parent.data.column
      $root
          .findAll(`[data-column="${id}"]`)
          .forEach(cell => $(cell).css({width: newWidth}))

      $resizer.css({transform: `translateX(0)`})
      $resizer.setAttribute('data-resizing', false)

      document.removeEventListener('mousemove', moveResizer)
      document.removeEventListener('mouseup', mouseUpResizer)
    }

    document.addEventListener('mousemove', moveResizer)
    document.addEventListener('mouseup', mouseUpResizer)
  } else {
    let newHeight = ''

    const moveResizer = (e) => {
      const initialHeight = $parent.getCords().height
      const delta = e.clientY - cords.bottom
      $resizer.css({transform: -delta > initialHeight ? 0 : `translateY(${delta}px)`})
      newHeight = delta + initialHeight + 'px'
    }

    const mouseUpResizer = () => {
      $parent.css({height: newHeight})
      $resizer.css({transform: `translateY(0)`})
      $resizer.setAttribute('data-resizing', false)

      document.removeEventListener('mousemove', moveResizer)
      document.removeEventListener('mouseup', mouseUpResizer)
    }

    document.addEventListener('mousemove', moveResizer)
    document.addEventListener('mouseup', mouseUpResizer)
  }
}
