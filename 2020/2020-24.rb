def _input()
	File.open('2020-24-input').read.split("\n")
	# File.open('2020-24-test').read.split("\n")
end

$floor = {} # 0 = white, 1 = black
$x = [0,0]
$y = [0,0]

def process_tile(s)
	s.reverse!
	x = 0
	y = 0

	while s.size > 0
		case s.pop
		when 'w' # ←
			x -= 2
		when 'e' # →
			x += 2
		when 's' # ↓
			y += 1
			x += s.pop == 'w' ? -1 : 1
		when 'n' # ↑
			y -= 1
			x += s.pop == 'w' ? -1 : 1
		end
	end

	$x[0] = x if x < $x[0]
	$x[1] = x if x > $x[1]
	$y[0] = y if y < $y[0]
	$y[1] = y if y < $y[1]

	pos = "#{x},#{y}"
	$floor[pos] = $floor[pos].nil? ? 1 : 1 - $floor[pos]
end

def day
	$floor.filter { |k, v| v == 1 }.size
end

_input.each { |s| process_tile s.split('') }

# p $floor.keys
p "minmax x: #{$x}, y: #{$y}"
p $floor.filter { |k, v| v == 1 }.size
