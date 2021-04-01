def _input()
	f = File.open('2020-12-input')
	f.read.split("\n").map { |l| m = l.match(/(\w)(\d+)/); [m[1].to_sym, m[2].to_i] }
end

$wx = 10
$wy = -1
$x = 0
$y = 0
$d = :E
$DL = { N: :W, W: :S, S: :E, E: :N }
$DR = { N: :E, E: :S, S: :W, W: :N }
$DO = { N: :S, S: :N, E: :W, W: :E }
#   asis	--				+-				-+			++
#	l tobe	-+				--				++			+-
#	r tobe	+-				++				--			-+
# swap		!!				__				__			++
# $DW = [ [1, -1], [1, -1], [1, -1], [1, -1] ]

def _r(len, mul)
	case len
	when 90
		$wx, $wy = $wy * mul * -1, $wx * mul
	when 180
		$wx, $wy = -$wx, -$wy
	when 270
		$wx, $wy = $wy * mul, $wx * mul * -1
	end
end

def _go(dir, len)
	case dir
	when :N
		$wy -= len
	when :S
		$wy += len
	when :E
		$wx += len
	when :W
		$wx -= len
	when :L
		# $d = len == 90 ? $DL[$d] : len == 270 ? $DR[$d] : $DO[$d]
		_r(len, -1)
	when :R
		# $d = len == 90 ? $DR[$d] : len == 270 ? $DL[$d] : $DO[$d]
		_r(len, 1)
	when :F
		$x += $wx * len
		$y += $wy * len
		# _go($d, len)
	end
	# pp "#{dir} #{len}: #{$x}, #{$y} | #{$d}"
	pp "#{dir} #{len}: w #{$wx}, #{$wy} | #{$x}, #{$y}"
end

_input().each { |data| _go *data }

pp "#{$x}, #{$y} = #{$x.abs + $y.abs}"
